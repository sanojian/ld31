
/*window.doPreload = function() {
	var Boot = function (game) {
	};
	Boot.prototype = {
		preload: function () {
			this.load.image('preloaderBackground', './assets/gfx/loadingBackground.png');
			this.load.image('preloaderBar', './assets/gfx/loadingBar.png');

		},
		create: function () {
			//this.input.maxPointers = 1;
			//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			//this.scale.setScreenSize(true);
			this.state.start('game');
		}
	};

	// Setup game
	window.g_phaserGame = new Phaser.Game(g_defs.screen.width, g_defs.screen.height, Phaser.AUTO, 'game');
	g_phaserGame.state.add('Boot', Boot);
	g_phaserGame.state.add('game', GameState);
	g_phaserGame.state.start('Boot');

};*/

var g_assetsObj = {
	audio: {
		//"beep": ["beep.wav", "beep.mp3", "beep.ogg"],
		//"boop": "boop.wav",
		//"slash": "slash.wav"
	},
	images: [],
	sprites: {
		'./assets/gfx/sprites.png': {
			tile: 12,
			tileh: 12,
			map: { player: [0,0] }
		},
		'./assets/gfx/orc.png': {
			tile: 12,
			tileh: 12,
			map: { orc: [0,0] }
		},
		'./assets/gfx/items.png': {
			tile: 12,
			tileh: 12,
			map: { bed: [0,0] }
		}
	}
};

Crafty.scene("loading", function () {
	Crafty.background("#00f");

	Crafty.load(g_assetsObj, function() {

		//Crafty.sprite(9, './assets/gfx/sprites.png', {
		//	player: [0, 0]
		//});

		loadMap('test');
	});

});