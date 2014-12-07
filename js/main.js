var g_game = {
	GRAVITY: -0.1,
	JUMPVY: 2,
	STARTX: 20,
	STARTY: 60
};

window.onload = function() {


	Crafty.init(g_defs.screen.width, g_defs.screen.height);

	// darkener
	var pos = jQuery("#cr-stage").position();
	jQuery("#canvasDarken").css( { position: "absolute", top: pos.top, left: pos.left,
		"z-index": 999 });
	g_game.darkCanvas = document.getElementById('canvasDarken');
	g_game.darkCanvas.width = g_defs.screen.width;
	g_game.darkCanvas.height = g_defs.screen.height;
	var ctxDark = g_game.darkCanvas.getContext('2d');
	ctxDark.fillStyle = "rgba(64, 64, 64, 0.5)";
	ctxDark.fillRect(0, 0, g_game.darkCanvas.width, g_game.darkCanvas.height);
	//ctxDark.scale(1,1);

	Crafty.scene("loading");


};

Crafty.scene("main", function () {

	var data = g_game.map;

	// draw map
	for (var i = 0; i < data.layers.length; i++) {
		if (data.layers[i].type == 'objectgroup') {
			for (var o=0; o<data.layers[i].objects.length; o++) {
				var obj = data.layers[i].objects[o];
				var mob = Crafty.e('2D, Canvas, ' + obj.type + ', ' + g_game.mobTiles[obj.gid].type)
					.attr( { x: obj.x, y: obj.y, z: 100 } );
				mob[obj.type]();
			}
		}
		else if (data.layers[i].type == 'tilelayer') {
			for (var y = 0; y < data.layers[i].height; y++) {
				for (var x = 0; x < data.layers[i].width; x++) {
					var id = data.layers[i].data[x + y * data.layers[i].width];
					if (id) {

						var el = Crafty.e('2D, Canvas, maptile_' + id +
							(data.layers[i].properties && data.layers[i].properties.classes ? ',' + data.layers[i].properties.classes : ''))
							.attr({ x: x * data.tilewidth, y: y * data.tilewidth });

						// adjust for taller items
						el.attr({ y: el.y - el.h + data.tileheight });

						// height above ground
						var z = data.layers[i].properties.zVal;
						z = z.replace(/y/g, el.y).replace(/h/g, el.h);
						eval('z = ' + z);
						el.attr({ z: Math.floor(z) });

						if (data.layers[i].properties && data.layers[i].properties.classes && data.layers[i].properties.classes.indexOf('solid') != -1) {
							el.addComponent('Collision');
							if (g_game.specialTiles[id]) {
								if (g_game.specialTiles[id].type == 'trunk') {
									el.collision(new Crafty.polygon([4, 25], [10, 25], [10, 30], [4, 30]));
								}
							}
						}
					}
				}
			}
		}
	}

	g_game.player = Crafty.e('2D, Canvas, Player, player, Multiway')
		.attr( { x: g_game.STARTX, y: g_game.STARTY, z: 100 } )
		.multiway(1, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
		.Player();

	Crafty.e("2D, Canvas, Text")
		.attr({ x: g_defs.screen.width/8, y: g_defs.screen.height-54, z: 10000 })
		.textFont({ size: '48px', family: "'Conv_ladybug px',Sans-Serif" })
		.textColor('#ffffff')
		.text('Nap Quest');

	Crafty.e("2D, Canvas, Text")
		.attr({ x: 3*g_defs.screen.width/4, y: g_defs.screen.height-32, z: 10000 })
		.textFont({ size: '24px', family: "'Conv_ladybug px',Sans-Serif" })
		.textColor('#ffffff')
		.text('by Sanojian');

	playMusic('song_1');
});

Crafty.scene("lose", function () {
	Crafty.background("#000");

	var text = Crafty.e("2D, Canvas, Text")
		.text(g_game.message)
		.textFont({ size: '48px', family: "'Conv_ladybug px',Sans-Serif" })
		.attr({ x: g_defs.screen.width/2, y: g_defs.screen.height/2-64, z: 10000 })
		.textColor('#ffffff');

	text.attr({ x: g_defs.screen.width/2 - text.w/2 });

	setTimeout(function() {
		text = Crafty.e("2D, Canvas, Text, Keyboard")
			.text('Press space to try again.')
			.textFont({ size: '24px', family: "'Conv_ladybug px',Sans-Serif" })
			.attr({ x: g_defs.screen.width/2, y: g_defs.screen.height/2+64, z: 10000 })
			.textColor('#ffffff')
			.bind('KeyDown', function(evt) {
				if (evt.key == 32) {
					Crafty.scene('main');
				}
			});

		text.attr({ x: g_defs.screen.width/2 - text.w/2 });
	}, 2000);

});

function playMusic(songName) {
	Crafty.audio.stop();

	Crafty.audio.play(songName, -1);
}

function winGame(message) {

	playMusic('song_win');
	g_game.message = message;
	Crafty.scene('lose');
}

function loseGame(message) {

	playMusic('song_lose');
	g_game.message = message;
	Crafty.scene('lose');
}