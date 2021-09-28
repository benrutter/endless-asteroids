const gameState = {

};

const config = {
	type: Phaser.AUTO,
	width: 500,
	height: 700,
	backgroundColor: "00000",
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
		}
	},
	scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);
