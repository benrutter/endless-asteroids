class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('alien', './assets/sprites/asteroid1.png');
    this.load.image('alien2', './assets/sprites/asteroid2.png');
		this.load.image('alien3', './assets/sprites/asteroid3.png')
    this.load.image('ship', './assets/sprites/spaceship.png');
    this.load.image('bullet', './assets/sprites/star.png');
    this.load.image('star', './assets/sprites/star.png');
	}

	create() {

    // variables for placement
    const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const fullY = this.cameras.main.worldView.y + this.cameras.main.height;
    const fullX = this.cameras.main.worldView.x + this.cameras.main.width;
		const sizeFactor = fullX / 1920;

    // controllers and set-up
    gameState.cursors = this.input.keyboard.createCursorKeys();

		// start variables for game
		gameState.shootRecharge = 0;
    gameState.score = 0;
    gameState.gameSpeed = 1;
		gameState.alive = true;

		// reset powerUp
		gameState.powerUps.chargeRate = 1;
		gameState.powerUps.traction = 2;
		gameState.powerUps.acceleration = 20;

    // score text
		gameState.scoreText = this.add.text(centerX, fullY-20, 'Score: 0', { fontSize: '30px', fill: '#FFFFFF' }).setOrigin(0.5);

    // player
    gameState.player = this.physics.add.sprite(centerX, fullY-50, 'ship').setScale(0.3);
    gameState.player.setCollideWorldBounds(true);

    // other groups
    gameState.bullets = this.physics.add.group();
		gameState.aliens = this.physics.add.group();
    gameState.stars = this.physics.add.group();

    // generator function
		const generatealien = () => {
      const randomSprite = ['alien', 'alien2', 'alien3'][Math.floor(Math.random() * 3)];
			const xCoord = Math.random() * fullX;
      const alienSpeed = Math.random() * 150 + 100;
		  gameState.aliens.create(xCoord, -50, randomSprite)
				.setVelocityY(alienSpeed * gameState.gameSpeed)
				.setScale(Math.random() * 0.4 + .4)
		}

		const generatealienHere = (x, y, xVelocity, scale2) => {
      const randomSprite = ['alien', 'alien2', 'alien3'][Math.floor(Math.random() * 3)];
      const alienSpeed = Math.random() * 150 + 100;
		  gameState.aliens.create(x, y, randomSprite)
				.setVelocityY(alienSpeed * gameState.gameSpeed)
				.setVelocityX(xVelocity)
				.setScale(scale2/1.5);
		}

    const generateStar = () => {
      const xCoord = Math.random() * fullX;
      const speed = Math.random() * 200;
      gameState.stars.create(xCoord, -50, 'star').setVelocityY(speed).setScale(speed/500);
    }


    const generatealienLoop = this.time.addEvent({
    	delay: 250/sizeFactor,
    	callback: generatealien,
    	callbackScope: this,
    	loop: true,
    });

    const generateStarLoop = this.time.addEvent({
      delay: 100,
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
    this.physics.add.collider(gameState.stars, gameState.bounds, star => {
      star.destroy();
      gameState.score += 1;
      gameState.scoreText.setText(`Score: ${gameState.score}`)
    });

    this.physics.add.collider(gameState.aliens, gameState.bullets, (alien, bullet) => {
      alien.destroy();
			bullet.destroy();
      gameState.score += 5;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
			if (alien._scaleX > 0.4) {
				generatealienHere(alien.x, alien.y, Math.random() * 70, alien._scaleX);
				generatealienHere(alien.x, alien.y, Math.random() * -70, alien._scaleX);
			}
			// chance of power-up!
			if (Math.random() < 0.1) {
				const powerUpChoose = Math.random();
				if (powerUpChoose < 0.33) {
					gameState.powerUps.chargeRate += 0.5;
					gameState.scoreText.setText('POWER UP!! (Shot rate)');
				} else if (powerUpChoose < 0.66) {
					gameState.powerUps.traction += 1;
					gameState.scoreText.setText('POWER UP!! (Traction up)');
				} else {
					gameState.powerUps.acceleration += 2;
					console.log(gameState.acceleration)
					gameState.scoreText.setText('POWER UP!! (Acceleration up)');
				}
			}
    });

		this.physics.add.collider(gameState.player, gameState.aliens, () => {
			// stop displaying ship and mark game as over
			// stop creating asteroids
			generatealienLoop.destroy();

			gameState.alive = false;
			// create 'debris' particle effect
			for (let i = 0; i < 500; i++) {
				gameState.stars.create(gameState.player.x, gameState.player.y, 'star')
					.setVelocityY(Math.random() * 100 - 5)
					.setVelocityX(Math.random() * 100 - 5)
					.setScale(0.2);
			}
			gameState.player.destroy();
			// present text and allow restart
			this.add.text(centerX, centerY-20, 'Game Over', { fontSize: '40px', fill: '#FFFFFF' }).setOrigin(0.5);
			this.add.text(centerX, centerY+20, 'Click to Restart', { fontSize: '40px', fill: '#FFFFFF' }).setOrigin(0.5);
			this.input.on('pointerup', () => {
				this.scene.restart();
			});
		});


	}

	update() {

		// destroy off screen bullets
		gameState.bullets.getChildren().forEach((item, i) => {
			if (item.body.y < this.cameras.main.y) {
				item.destroy();
			}
		});

		gameState.stars.getChildren().forEach((item, i) => {
			if (item.body.y > this.cameras.main.y + this.cameras.main.height) {
				item.destroy();
			}
		});

		gameState.aliens.getChildren().forEach((item, i) => {
			if (item.body.y > this.cameras.main.y + this.cameras.main.height + 100) {
				item.destroy();
			}
		});


		if (gameState.alive) {
	    gameState.gameSpeed += 0.001;
	    gameState.shootRecharge = Math.max(gameState.shootRecharge - gameState.powerUps.chargeRate, 0);

	    // ship controls
	    // move velocity slowly to 0 (delay for drift feeling)
	    const xVelocity = gameState.player.body.velocity.x;
	    const yVelocity = gameState.player.body.velocity.y;

			gameState.player.setAngle(xVelocity/20);

			if (gameState.cursors.left.isDown) {
				gameState.player.setVelocityX(xVelocity - gameState.powerUps.acceleration);
			} else if (gameState.cursors.right.isDown) {
				gameState.player.setVelocityX(xVelocity + gameState.powerUps.acceleration);
			} else if (gameState.cursors.up.isDown) {
	      gameState.player.setVelocityY(yVelocity - gameState.powerUps.acceleration);
	    } else if (gameState.cursors.down.isDown) {
	      gameState.player.setVelocityY(yVelocity + gameState.powerUps.acceleration);
	    } else {
	      if (xVelocity > 0) {
	        gameState.player.setVelocityX(xVelocity - gameState.powerUps.traction);
	      } else if (xVelocity < 0) {
	        gameState.player.setVelocityX(xVelocity + gameState.powerUps.traction);
	      }
	      if (yVelocity > 0) {
	        gameState.player.setVelocityY(yVelocity - gameState.powerUps.traction);
	      } else if (yVelocity < 0) {
	        gameState.player.setVelocityY(yVelocity + gameState.powerUps.traction);
	      }
			}

	    // shooting on space
	    if (gameState.cursors.space.isDown) {
	      if (gameState.shootRecharge <= 0) {
	        gameState.bullets
						.create(gameState.player.x, gameState.player.y - 20, 'bullet')
						.setVelocityY(-500)
						.setVelocityX(xVelocity);
	        gameState.shootRecharge += 20;


	      }
	    }
		}

	}
}
