class StartScene extends Phaser.Scene {

	constructor() {
		super({ key: 'StartScene' })
	}

  preload() {
    this.load.image('star', 'https://labs.phaser.io/assets/sprites/16x16.png')
  }

	create() {

    // variables for placement
    const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const fullY = this.cameras.main.worldView.y + this.cameras.main.height;
    const fullX = this.cameras.main.worldView.x + this.cameras.main.width;

    // star background effect
    const stars = this.physics.add.group();

    const generateStar = () => {
      const xCoord = Math.random() * fullX;
      const speed = Math.random() * 200;
      stars.create(xCoord, -50, 'star').setVelocityY(speed).setScale(speed/500);
    }

    const generateStarLoop = this.time.addEvent({
      delay: 200,
      callback: generateStar,
      callbackScope: this,
      loop: true,
    })

    // intro text
		this.add.text(centerX, centerY - 50, 'Endless Asteroids', {fill: '#FFFFFF', fontSize: '40px'}).setOrigin(0.5);
    this.add.text(centerX, centerY + 50, 'Click to start', {fill: '#FFFFFF', fontSize: '20px'}).setOrigin(0.5);

    // click to start
    this.input.on('pointerdown', () => {
			this.scene.stop('StartScene')
			this.scene.start('GameScene')
		})

	}
}
