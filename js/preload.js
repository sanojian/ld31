
var g_assetsObj = {
	audio: {
		jump: ['./assets/sfx/jump.wav'],
		click: ['./assets/sfx/click.wav'],
		song_win: ['https://dl.dropboxusercontent.com/u/102070389/ld31/chill.OGG'],
		song_lose: ['https://dl.dropboxusercontent.com/u/102070389/ld31/lose.OGG'],
		song_1: ['https://dl.dropboxusercontent.com/u/102070389/ld31/happy_stroll.OGG']
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
	Crafty.background("#000");

	Crafty.load(g_assetsObj, function() {

		setTimeout(function() {

			var text = Crafty.e("2D, Canvas, Text")
				.text('Nap Quest')
				.textFont({ size: '64px', family: "'Conv_ladybug px',Sans-Serif" })
				.attr({ x: g_defs.screen.width / 2, y: g_defs.screen.height / 8, z: 10000 })
				.textColor('#ffffff');

			text.attr({ x: g_defs.screen.width / 2 - text.w / 2 });

			text = Crafty.e("2D, Canvas, Text")
				.text('Adventure Takes a Holiday')
				.textFont({ size: '48px', family: "'Conv_ladybug px',Sans-Serif" })
				.attr({ x: g_defs.screen.width / 2, y: g_defs.screen.height / 8 + 64, z: 10000 })
				.textColor('#ffffff');

			text.attr({ x: g_defs.screen.width / 2 - text.w / 2 });

			Crafty.e("2D, Canvas, Text")
				.attr({ x: 3*g_defs.screen.width/4, y: g_defs.screen.height-32, z: 10000 })
				.textFont({ size: '24px', family: "'Conv_ladybug px',Sans-Serif" })
				.textColor('#ffffff')
				.text('by Sanojian');

		}, 1000);

		Crafty.e("2D, DOM, ProgressBar")
			.attr({ x: g_defs.screen.width/2 - 100, y: g_defs.screen.height/2, w: 200, h: 25, z: 100 })
			// progressBar(Number maxValue, Boolean flipDirection, String emptyColor, String filledColor)
			.progressBar(100, false, "blue", "green")
			.bind("LOADING_PROGRESS", function(percent) {
				// updateBarProgress(Number currentValue)
				this.updateBarProgress(percent);
			});


	}, function(prog) {
		// Object {loaded: 3, total: 11, percent: 27.27272727272727, ...
		Crafty.trigger("LOADING_PROGRESS", prog.percent);

		if (prog.percent == 100) {
			setTimeout(function() {
				text = Crafty.e("2D, Canvas, Text, Keyboard")
					.text('Press space to play.')
					.textFont({ size: '24px', family: "'Conv_ladybug px',Sans-Serif" })
					.attr({ x: g_defs.screen.width/2, y: 3*g_defs.screen.height/4+64, z: 10000 })
					.textColor('#ffffff')
					.bind('KeyDown', function(evt) {
						if (evt.key == 32) {
							loadMap('test');
						}
					});

				text.attr({ x: g_defs.screen.width/2 - text.w/2 });
			}, 500);

		}
	});

});