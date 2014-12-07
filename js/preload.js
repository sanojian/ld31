
var g_assetsObj = {
	audio: {
		jump: ['./assets/sfx/jump.wav'],
		click: ['./assets/sfx/click.wav']
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
		'./assets/gfx/king.png': {
			tile: 12,
			tileh: 12,
			map: { king: [0,0] }
		},
		'./assets/gfx/zombie.png': {
			tile: 12,
			tileh: 12,
			map: { zombie: [0,0] }
		},
		'./assets/gfx/peasant.png': {
			tile: 12,
			tileh: 12,
			map: { peasant: [0,0] }
		},
		'./assets/gfx/items.png': {
			tile: 16,
			tileh: 16,
			map: { bed: [0,0], fire: [1, 0] }
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