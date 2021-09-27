class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('alien', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
    this.load.image('alien2', 'https://labs.phaser.io/assets/sprites/space-baddie-purple.png');
    this.load.image('ship', 'https://labs.phaser.io/assets/sprites/xenon2_ship.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png');
    this.load.image('star', 'https://labs.phaser.io/assets/sprites/16x16.png');
	}

	create() {

    // variables for placement
    const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const fullY = this.cameras.main.worldView.y + this.cameras.main.height;
    const fullX = this.cameras.main.worldView.x + this.cameras.main.width;

    // start variables for game
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.shootRecharge = 0;
    gameState.score = 0;
    gameState.gameSpeed = 1;

    // score text
		gameState.scoreText = this.add.text(centerX, fullY-20, 'Score: 0', { fontSize: '20px', fill: '#FFFFFF' }).setOrigin(0.5);

    // player
    gameState.player = this.physics.add.sprite(centerX, fullY-50, 'ship').setScale(1);
    gameState.player.setCollideWorldBounds(true);

    // platform below screen to clear items as they pass
    gameState.bounds = this.physics.add.staticGroup();
    gameState.bounds.create(0, fullY+100, 'ground').setScale(2).refreshBody();

    // platform above screen to clear items as they pass
    gameState.bounds = this.physics.add.staticGroup();
    gameState.bounds.create(0, -300, 'ground').setScale(2).refreshBody();

    // other groups
    gameState.bullets = this.physics.add.group();
		gameState.aliens = this.physics.add.group();
    gameState.stars = this.physics.add.group();


    // generator function
		const generatealien = () => {
      const randomSprite = ['alien', 'alien2'][Math.floor(Math.random() * 2)];
			const xCoord = Math.random() * fullX;
      const alienSpeed = Math.random() * 150 + 100;
		  gameState.aliens.create(xCoord, -50, randomSprite).setVelocityY(alienSpeed * gameState.gameSpeed).setScale(Math.random() * 2 + 2);
		}

    const generateStar = () => {
      const xCoord = Math.random() * fullX;
      const speed = Math.random() * 200;
      gameState.stars.create(xCoord, -50, 'star').setVelocityY(speed).setScale(speed/500);
    }


    const generatealienLoop = this.time.addEvent({
    	delay: 500,
    	callback: generatealien,
    	callbackScope: this,
    	loop: true,
    });

    const generateStarLoop = this.time.addEvent({
      delay: 200,
      callback: generateStar,
      callbackScope: this,
      loop: true,
    });

    // prepopulating star field
    for (let i = 0; i < 30; i++) {
      const xCoord = Math.random() * fullX;
      const yCoord = Math.random() * fullY;
      const speed = Math.random() * 200;
      gameState.stars.create(xCoord, yCoord, 'star').setVelocityY(speed).setScale(speed/500);
    }

    // collisions
    this.physics.add.collider(gameState.aliens, gameState.bounds, alien => {
      alien.destroy();
      gameState.score += 1;
      gameState.scoreText.setText(`Score: ${gameState.score}`)
    });

    this.physics.add.collider(gameState.bullets, gameState.bounds, bullet => {
      bullet.destroy();
    });

    this.physics.add.collider(gameState.stars, gameState.bounds, star => {
      star.destroy();
      gameState.score += 1;
      gameState.scoreText.setText(`Score: ${gameState.score}`)
    });

    this.physics.add.collider(gameState.aliens, gameState.bullets, alien => {
      alien.destroy();
      gameState.score += 5;
      gameState.scoreText.setText(`Score: ${gameState.score}`)
    });

		this.physics.add.collider(gameState.player, gameState.aliens, () => {
			generatealienLoop.destroy();
			this.physics.pause();
			this.add.text(centerX, centerY-20, 'Game Over', { fontSize: '20px', fill: '#FFFFFF' }).setOrigin(0.5);
			this.add.text(centerX, centerY+20, 'Click to Restart', { fontSize: '20px', fill: '#FFFFFF' }).setOrigin(0.5);
			this.input.on('pointerup', () => {
				this.scene.restart();
			});
		});
	}

	update() {
    gameState.gameSpeed += 0.001;
    gameState.shootRecharge = Math.max(gameState.shootRecharge - 1, 0);

    // ship controls
    // move velocity slowly to 0 (delay for drift feeling)
    const xVelocity = gameState.player.body.velocity.x;
    const yVelocity = gameState.player.body.velocity.y;

		if (gameState.cursors.left.isDown) {
			gameState.player.setVelocityX(xVelocity - 20);
		} else if (gameState.cursors.right.isDown) {
			gameState.player.setVelocityX(xVelocity + 20);
		} else if (gameState.cursors.up.isDown) {
      gameState.player.setVelocityY(yVelocity - 20);
    } else if (gameState.cursors.down.isDown) {
      gameState.player.setVelocityY(yVelocity + 20);
    } else {
      if (xVelocity > 0) {
        gameState.player.setVelocityX(Math.max(xVelocity - 2, -200));
      } else if (xVelocity < 0) {
        gameState.player.setVelocityX(Math.min(xVelocity + 2, 200));
      }
      if (yVelocity > 0) {
        gameState.player.setVelocityY(Math.max(yVelocity - 2, -200));
      } else if (yVelocity < 0) {
        gameState.player.setVelocityY(Math.min(yVelocity + 2, 200));
      }
		}

    // shooting on space
    if (gameState.cursors.space.isDown) {
      if (gameState.shootRecharge <= 0) {
        gameState.bullets.create(gameState.player.x, gameState.player.y, 'bullet').setVelocityY(-500);
        gameState.shootRecharge += 20;
      }
    }

	}
}
