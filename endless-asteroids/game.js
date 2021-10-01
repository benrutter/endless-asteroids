const gameState = {
	powerUps: {
		chargeRate: 1,
		traction: 2,
		acceleration: 20,
	}
};

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth * window.devicePixelRatio * 0.9,
	height: window.innerHeight * window.devicePixelRatio * 0.9,
	backgroundColor: "00000",
	input: {
		gamepad: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
		}
	},
	scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);
