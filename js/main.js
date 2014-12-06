/*var GameState = function(game) {
};


// Load images and sounds
GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {

	this.game.stage.backgroundColor = 0x44cc88;

};

GameState.prototype.update = function() {

};*/

var g_game = {};

window.onload = function() {

	//doPreload();



	Crafty.init(g_defs.screen.width, g_defs.screen.height);
	//doCraftyInitialization();

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
					el.attr( { z: Math.floor(z) });

					if (data.layers[i].properties && data.layers[i].properties.classes && data.layers[i].properties.classes.indexOf('solid') != -1) {
						el.addComponent('Collision');
						if (g_game.specialTiles[id]) {
							if (g_game.specialTiles[id].type == 'trunk') {
								el.collision(new Crafty.polygon([4, 25], [10, 25], [10, 30], [4, 30]));
								//el.attr({ z: el.z - 240 });
							}

						}
					}
				}
			}
		}
	}

	g_game.player = Crafty.e('2D, Canvas, Player, player, Multiway')
		.attr( { x: 80, y: 40, z: 100 } )
		.multiway(1, {W: -90, S: 90, D: 0, A: 180})
		.Player();

	var mob = Crafty.e('2D, Canvas, NPC, orc')
		.attr( { x: 180, y: 140, z: 100 } )
		.NPC();
	Crafty.e('2D, Canvas, NPC, orc')
		.attr( { x: 280, y: 140, z: 100 } )
		.NPC();

	Crafty.e('2D, Canvas, bed, Collision')
		.attr( { x: 280, y: 140, z: 100 } )
		.collision();



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

});

// fix for Webkit browsers too fast
jQuery.fn.aPosition = function() {
	var thisLeft = this.offset().left;
	var thisTop = this.offset().top;
	var thisParent = this.parent();

	var parentLeft = thisParent.offset().left;
	var parentTop = thisParent.offset().top;

	return {
		left: thisLeft-parentLeft,
		top: thisTop-parentTop
	};
};