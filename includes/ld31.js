var g_defs = {
	screen: {
		width: 1024,
		height: 640
	},
	speech: {
		orc: [
			'We have ale',
			'Drink some'
		],
		peasant: [
			'We need a hero',
			'Save us',
			'My house has rats'
		],
		king: [
			'Save the princess',
			'I have a quest',
			'Oh noble knight'
		],
		zombie: [
			'Am easy kill',
			'Ancient sword',
			'Find my crypt'
		]
	},
	caught: {
		orc: [
			'Dont drink with orcs',
			'What a hangover you will have'
		],
		king: [
			'The Princess snores',
			'You have to kill 5 spiders'
		],
		zombie: [
			'Grave robbing again?',
			'Is spine rot contagious?'
		],
		peasant: [
			'Have fun killing rats',
			'Take a message to Timbuktu'
		]
	}
};

/**
 * Created by jonas on 12/7/2014.
 */

Crafty.c('Bed', {

	Bed: function() {
		this.requires('hasShadow, bed, solid, Collision')
			.collision()
			.bind("EnterFrame", function (frameObj) {

			});

		return this;
	}
});

Crafty.c('Fire', {

	Fire: function() {
		this.requires('fire, Delay')
			.bind("EnterFrame", function (frameObj) {
				if (this.lighter) {
					this.lighter.attr({ x: this.x - this.lighter.radius + this.w / 2, y: this.y - this.lighter.radius + 7 * this.h / 8, z: this.z - 20 });
				}
			});

		//this.lighter = Crafty.e('2D, Canvas, LightSource').LightSource(this, 64, '32,32,32');

		return this;
	},
	attachLight: function() {
		this.lighter = Crafty.e('2D, Canvas, LightSource').LightSource(this, 64, '32,32,32');
	}
});

/**
 * Created by jonas on 12/6/2014.
 */

Crafty.c('Shadows', {

	Shadows: function(source, radius) {
		this.requires('Collision').attr({ z: 5 });

		this.source = source;
		this.origRadius = this.radius = radius;
		this.origX = this.x;
		this.origY = this.y;
		this.w = this.h = this.radius * 2;

		this.collision();

		return this;
	},

	draw: function() {

		var ctx = Crafty.canvas.context;
		// shadow
		//ctx = g_game.darkCanvas.getContext('2d');
		//ctx.globalCompositeOperation = "destination-over";
		//ctx.globalCompositeOperation = 'source-over';//"destination-over";
		var radgrad = ctx.createRadialGradient(this.x + this.radius, this.y + this.radius, 3*this.radius/4, this.x + this.radius, this.y + this.radius, this.radius);
		radgrad.addColorStop(0, 'rgba(64,64,64,0.6)');
		radgrad.addColorStop(1, 'rgba(64,64,64,0)');
		ctx.fillStyle = radgrad;
		var solids = this.hit('hasShadow');
		for (var i=0;i<solids.length;i++) {
			if (this.source != solids[i].obj) {
				var dx = this.x + this.w/2 - (solids[i].obj.x + solids[i].obj.w/2);
				var dy = this.y + this.h/2 - (solids[i].obj.y + solids[i].obj.h/2);
				//var angle = Math.atan2(dy, dx);
				ctx.beginPath();
				var bx = solids[i].obj.map.points[0][0];
				var by = solids[i].obj.map.points[0][1];
				var bw = solids[i].obj.map.points[1][0] - solids[i].obj.map.points[0][0];
				var bh = solids[i].obj.map.points[2][1] - solids[i].obj.map.points[0][1];
				var Ax, Ay, Dx, Dy = 0;
				if (dx < 0 && dy > 0) {			// upper right
					Ax = bx;
					Ay = by;
					Dx = bx + bw;
					Dy = by + bh;
				}
				else if (dx < 0 && dy < 0) {	// lower right
					Ax = bx + bw;
					Ay = by;
					Dx = bx;
					Dy = by + bh;
				}
				else if (dx > 0 && dy > 0) {	// upper left
					Ax = bx;
					Ay = by + bh;
					Dx = bx + bw;
					Dy = by;
				}
				else if (dx > 0 && dy < 0) {	// lower left
					Ax = bx;
					Ay = by;
					Dx = bx + bw;
					Dy = by + bh;
				}
				ctx.moveTo(Ax, Ay);
				var angle = Math.atan2(this.y + this.h/2 - Ay, this.x + this.w/2 - Ax);
				ctx.lineTo(Ax - Math.cos(angle) * this.radius, Ay - Math.sin(angle) * this.radius);
				angle = Math.atan2(this.y + this.h/2 - Dy, this.x + this.w/2 - Dx);
				ctx.lineTo(Dx - Math.cos(angle) * this.radius, Dy - Math.sin(angle) * this.radius);
				ctx.lineTo(Dx, Dy);

				ctx.closePath();
				ctx.fill();
			}
		}

		// back to default
		Crafty.canvas.context.globalCompositeOperation = "source-over";

	}

});

Crafty.c('LightSource', {

	LightSource: function(source, radius, color, bFlicker) {
		this.requires('Delay');

		this.source = source;
		this.origRadius = this.radius = radius;
		this.origX = this.x;
		this.origY = this.y;
		this.w = this.h = this.radius * 2;
		this.color = color;
		this.flicker = 0.2;

		if (bFlicker) {
			this.doFlicker();
		}

		this.shadows = Crafty.e('2D, Canvas, Shadows').Shadows(this.source, radius);
		this.attach(this.shadows);

		return this;
	},

	doFlicker: function() {
		var amt = Math.random();
		this.flicker = 0.3 + 0.3 * amt;
		var diff = this.origRadius/32 + amt*this.origRadius/16;
		this.radius = this.origRadius - diff;
		this.x = this.origX + diff;
		this.y = this.origY + diff;
		// TODO: try this
		this.trigger("Change");
		//Crafty.DrawManager.drawAll({ _x: this.x, _y: this.y, _w: this.w, _h: this.h });
		var self = this;
		this.delay(function() { self.doFlicker(); }, 100 + 400 * Math.random());
	},

	draw: function() {
		// set flag that darkness needs to be refreshed on next frame
		g_game.needRedrawDarkness = true;

		var ctx = Crafty.canvas.context;

		// light
		ctx.globalCompositeOperation = 'source-atop';//"lighter";
		var radgrad = ctx.createRadialGradient(this.x + this.radius, this.y + this.radius, this.radius/8, this.x + this.radius, this.y + this.radius, this.radius);
		radgrad.addColorStop(0, 'rgba(' + this.color + ',' + this.flicker.toFixed(2) + ')');
		radgrad.addColorStop(1, 'rgba(' + this.color + ',0)');

		ctx.fillStyle = radgrad;
		ctx.beginPath();
		ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI*2, false);
		ctx.closePath();
		ctx.fill();

		// back to default
		Crafty.canvas.context.globalCompositeOperation = "source-over";
	}
});

/**
 * Created by jonas on 12/6/2014.
 */

function loadMap(strMap) {

	g_game.specialTiles = {};
	g_game.mobTiles = {};

	$.getJSON('./assets/maps/' + strMap + '.json?' + Math.random(), function(data) {

		for (var i=0;i<data.tilesets.length;i++) {
			var myMap = {};
			var width = data.tilesets[i].imagewidth / data.tilesets[i].tilewidth;
			var height = data.tilesets[i].imageheight / data.tilesets[i].tileheight;

			for (var y=0;y<height;y++) {
				for (var x=0;x<width;x++) {
					var id = data.tilesets[i].firstgid + y*width+x;
					myMap['maptile_' + id] = [x*data.tilesets[i].tilewidth, y*data.tilesets[i].tileheight, data.tilesets[i].tilewidth, data.tilesets[i].tileheight];
					if (data.tilesets[i].name == 'trunk') {
						g_game.specialTiles[id] = { type: data.tilesets[i].name };
					}
					else {
						// any image can be a mob
						g_game.mobTiles[id] = { type: data.tilesets[i].name };
					}
				}
			}

			Crafty.sprite(1, './assets/maps/' + data.tilesets[i].image, myMap);
			//Crafty.sprite(data.tilesets[i].tilewidth, './assets/maps/' + data.tilesets[i].image, myMap);
		}

		g_game.map = data;
		g_game.darknessLevel = 0.9;//data.properties.darkness;

		Crafty.scene("main"); //when everything is loaded, run the main scene

	});
}

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

	Crafty.audio.play(songName, 25);
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
/**
 * Created by jonas on 12/6/2014.
 */

Crafty.c('MOB', {

	MOB: function() {
		this.requires("SpriteAnimation, Grid, Collision, Mouse")
			.reel('Walk', 1000*Crafty.timer.FPS()/(48*4), [[0, 0], [1, 0]])
			//.collision(new Crafty.polygon([16, 48], [48, 48], [48, 62], [16, 62]))
			.collision(new Crafty.polygon([this.w/4, this.h/2], [this.w - this.w/4, this.h/2], [this.w - this.w/4, this.h], [this.w/4, this.h]))
			//.areaMap([16,12],[48,12],[48,62],[16,62])
			.bind('NewDirection', function(dir) {
				if (this.direction.x == dir.x && this.direction.y == dir.y) {
					return;
				}
				this.direction.x = dir.x;
				this.direction.y = dir.y;
				if (dir.x > 0) {
					this.unflip();
				}
				else {
					this.flip();
				}
				if (dir.x === 0 && dir.y === 0) {
					this.pauseAnimation().resetAnimation();
				}
				else {
					this.animate('Walk', -1);
				}
			})
			.bind('EnterFrame', function(frameObj) {
				if (this.lighter) {
					this.lighter.attr({ x: this.x - this.lighter.radius + this.w / 2, y: this.y - this.lighter.radius + 7 * this.h / 8, z: this.z - 20 });
				}
			})
			.bind('Moved', function(from) {
				if (this.hit('impassible')) {
					this.attr({ x: from.x, y: from.y });
				}
				else {
					this.attr({ z: Math.floor((this.y + this.h) * 10 + 5) });

				}
			});

		this.direction = { x: 0, y: 0 };

		return this;
	},
	addLighter: function(radius, color, bFlicker) {
		if (this.lighter) {
			return;
		}
		Crafty.audio.play('click');
		this.lighter = Crafty.e('2D, Canvas, LightSource').LightSource(this, radius, color, bFlicker);
	}

});

/**
 * Created by jonas on 12/6/2014.
 */

Crafty.c('NPC', {
	//mySpeed: 0.5,

	NPC: function() {
		this.requires('MOB, Delay')
			.bind("EnterFrame", function (frameObj) {
				var newDir;
				if (this.direction.x || this.direction.y) {
					var from = { x: this.x, y: this.y };
					this.attr( { x: this.x + this.direction.x * this.mySpeed, y: this.y + this.direction.y * this.mySpeed } );
					this.trigger('Moved', from);
				}
				if (this.lighter && (frameObj.frame + this.randomizer) % 40 === 0) {
					// follow player
					this.mySpeed = 1;

					newDir = { x: 0, y: 0 };
					var dx =  g_game.player.x - this.x;
					var dy = g_game.player.y - this.y;
					var angle = Math.atan2(dy, dx);
					newDir.y = 1 * Math.sin(angle);
					newDir.x = 1 * Math.cos(angle);

					/*if (dx !== 0) {
						newDir.x = Math.abs(dx)/dx;
					}
					if (dy !== 0) {
						newDir.y = Math.abs(dy)/dy;
					}*/
					this.trigger('NewDirection', newDir);
					//this.speak('I get you');
					var num = Math.floor(Math.random() * g_defs.speech[this.myType].length);
					this.speak(g_defs.speech[this.myType][num]);
				}
				else if (!this.lighter && (frameObj.frame + this.randomizer) % 100 === 0) {
					newDir = { x: 0, y: 0 };
					newDir.x = -1 + Math.floor(Math.random() * 3);
					newDir.y = -1 + Math.floor(Math.random() * 3);
					this.trigger('NewDirection', newDir);
					//this.speak('Dis way now');
				}
				if (this.hit('player')) {
					if (g_game.player.jump && g_game.player.jump.h > 4) {
						return;
					}
					else {
						var msg = Math.floor(Math.random() * g_defs.caught[this.myType].length);
						loseGame(g_defs.caught[this.myType][msg]);
					}
				}
			})
			.MOB();

		this.randomizer = Math.floor(Math.random()*20) - 10;

		this.speech = Crafty.e("2D, Canvas, Text")
			.attr({ x: this.x + this.w/2, y: this.y - this.h, z: 10000 })
			.textFont({ size: '8px', family: "'Conv_ladybug px',Sans-Serif" })
			.textColor('#DEEED6')
			.text('');

		this.attach(this.speech);

		this.mySpeed = 0.5;

		if (this.has('orc')) {
			this.myType = 'orc';
		}
		else if (this.has('peasant')) {
			this.myType = 'peasant';
		}
		else if (this.has('king')) {
			this.myType = 'king';
		}
		else if (this.has('zombie')) {
			this.myType = 'zombie';
		}

		return this;
	},
	speak: function(text) {
		if (this.speech.text()) {
			return; // already speaking
		}
		this.speech.text(text).attr({ x: this.x + this.w/2 - this.speech.w/2 });
		this.delay(function() {
			this.speech.text('');
		}, 150 * text.length);
	}
});

/**
 * Created by jonas on 12/6/2014.
 */

Crafty.c('Player', {

	Player: function() {
		this.requires("MOB")
			.bind("NewDirection", function (direction) {
			})
			.bind('Move', function() {
				//g_game.mapHandler.changeLoc(this.x, this.y);
			})
			.bind('KeyDown', function(evt) {
				if (evt.key == 32 && !this.jump) {
					this.disableControl();
					Crafty.audio.play('jump');
					this.jump = {
						origY: this.y,
						h: 0,
						vY: g_game.JUMPVY
					};
				}
			})
			.bind('EnterFrame', function(evt) {
				this.frames = evt.frame;

				// check world bounds
				if (this.x < 0 || this.x > g_defs.screen.width || this.y < 0 || this.y > g_defs.screen.height) {
					loseGame('No adventures!  Go to bed.');
					return;
				}

				if (this.jump) {
					this.jump.h += this.jump.vY;
					this.jump.vY += g_game.GRAVITY;
					if (this.jump.h <= 0) {
						this.y = this.jump.origY;
						this.jump = null;
					}
					else {
						this.y = this.jump.origY - this.jump.h;
						this.enableControl();
					}
					this.trigger('Moved', { x: this.x, y: this.y });
				}

				if (g_game.needRedrawDarkness) {
					// darkness for the world
					var lights = Crafty('LightSource');
					var ctxDark = g_game.darkCanvas.getContext('2d');
					ctxDark.globalCompositeOperation = "source-over";
					ctxDark.clearRect(0, 0, g_game.darkCanvas.width, g_game.darkCanvas.height);
					ctxDark.fillStyle = 'rgba(64,64,64,' + g_game.darknessLevel + ')';
					ctxDark.fillRect(0, 0, g_game.darkCanvas.width, g_game.darkCanvas.height);
					for (var i=0;i<lights.length;i++) {
						var light = Crafty(lights[i]);
						ctxDark.globalCompositeOperation = 'destination-out';
						var x = light.x;
						var y = light.y;
						var radgrad = ctxDark.createRadialGradient(x + light.radius, y + light.radius, light.radius/8, x + light.radius, y + light.radius, light.radius);
						radgrad.addColorStop(0, 'rgba(0,0,0,1)');
						radgrad.addColorStop(1, 'rgba(0,0,0,0)');
						ctxDark.fillStyle = radgrad;
						ctxDark.beginPath();
						ctxDark.arc(x + light.radius, y + light.radius, light.radius, 0, Math.PI*2, false);
						ctxDark.closePath();
						ctxDark.fill();
					}

					g_game.needRedrawDarkness = false;
				}

				var mobs = this.lighter.shadows.hit('NPC');
				if (mobs) {
					for (var m=0;m<mobs.length;m++) {
						mobs[m].obj.addLighter(64, '256,128,128');
					}
				}

				var win = this.hit('Bed');
				if (win) {
					winGame('Naptime!  You win!');
				}

			})
			.MOB();

		this.addLighter(96, '255,255,128');
		//this.lighter = Crafty.e('2D, Canvas, LightSource').LightSource(this, 128, '255,255,128');

		return this;
	},
	shootSpell: function(x, y) {
		var r = 96;
		var ox = this.x + this.w - r;
		var oy = this.y + this.h - r;
		var dx = x - r - ox;
		var dy = y - r - oy;
		var angle = Math.atan2(dy, dx);
		var bolt = Crafty.e('2D, Canvas, Bolt')
			.attr( { x: ox + r/2, y: oy + r/2, z: this.z } )
			.Bolt(5, 100, angle, '0,207,203', r);
	}
});

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
/**@
 * #ProgressBar
 * @category Custom
 *
 * Used to display the progress of a specific task (e.g. progress of asset loading, HP bar).
 * Internally it creates two 2D blocks representing the empty and full part of the progress spectrum.
 * These blocks adjust their size with respect to the current progress.
 * Changes to the progress bar's 2D properties are reflected on to the blocks.
 * The blocks cut the bar along the highest progress bar's dimension
 * (blocks span horizontally if progressbar.width >= progressbar.height).
 *
 */
Crafty.c("ProgressBar", {
	init: function(entity) {
		this.requires("2D");
		this._pbFilledFraction = 0;
	},

	/**@
	 * #.updateBarProgress
	 * @comp ProgressBar
	 * @sign public this .updateBarProgress(Number currentValue)
	 * @param currentValue - The current progress. The value must be a 0 <= number <= maxValue
	 * representing the current progress.
	 * @return this - The current entity for chaining.
	 *
	 * Update method to update the current progress of the progressbar.
	 */
	updateBarProgress: function(val) {
		this._pbFilledFraction = val / this._pbMaxValue;
		if (this._pbFlipDirection)
			this._pbFilledFraction = 1 - this._pbFilledFraction;

		this._updateBarDimension();

		return this;
	},

	_updateBarDimension: function() {
		this._pbBlockWidth = this._w * this._pbFilledFraction;
		this._pbBlockHeight = this._h * this._pbFilledFraction;

		if (this._pbBlockWidth >= this._pbBlockHeight) {
			this._pbLowerBlock.attr({ x: this._x, y: this._y,
				w: this._pbBlockWidth, h: this._h });

			this._pbHigherBlock.attr({ x: this._x + this._pbBlockWidth, y: this._y,
				w: this._w - this._pbBlockWidth, h: this._h });
		} else {
			this._pbLowerBlock.attr({ x: this._x, y: this._y,
				w: this._w, h: this._pbBlockHeight });

			this._pbHigherBlock.attr({ x: this._x, y: this._y + this._pbBlockHeight,
				w: this._w, h: this._h - this._pbBlockHeight });
		}

		return this;
	},

	_updateBarOrder: function() {
		this._pbLowerBlock.z = this._z;
		this._pbHigherBlock.z = this._z;
	},


	/**@
	 * #.progressBar
	 * @comp ProgressBar
	 * @sign public this .progressBar(Number maxValue, Boolean flipDirection,
	 * String emptyColor, String filledColor)
	 * @param maxValue - The maximum value the incoming value can have.
	 * @param flipDirection - Whether to flip the fill direction. False to fill blocks from left/top
	 * to right/bottom. True to inverse.
	 * @param emptyColor - The color for 2D blocks that are empty.
	 * @param filledColor - The color for 2D blocks that are filled.
	 * @return this - The current entity for chaining.
	 *
	 * Constructor method to setup the progress bar.
	 *
	 * @example
	 * ~~~
	 * var progressBar = Crafty.e("2D, DOM, ProgressBar")
	 *   .attr({ x: 150, y : 140, w: 100, h: 25, z: 100 })
	 *   .progressBar(100, false, "blue", "green");
	 * ...
	 * progressBar.updateBarProgress(someValue);
	 * ~~~
	 */
	progressBar : function(maxValue, flipDirection, emptyColor, filledColor) {
		this._pbMaxValue = maxValue;
		this._pbFlipDirection = flipDirection;
		var renderMethod = this.has("Canvas") ? "Canvas" : "DOM";


		this._pbLowerBlock = Crafty.e("2D, " + renderMethod + ", Color")
			.color(flipDirection ? emptyColor : filledColor);
		this._pbHigherBlock = Crafty.e("2D, " + renderMethod + ", Color")
			.color(flipDirection ? filledColor : emptyColor);
		this.attach(this._pbLowerBlock);
		this.attach(this._pbHigherBlock);

		this._updateBarDimension();
		this._updateBarOrder();

		this.bind("Resize", this._updateBarDimension);
		this.bind("reorder", this._updateBarOrder);
		this.bind("RemoveComponent", function(component) {
			if (component === "ProgressBar") {
				this.unbind("Resize", this._updateBarDimension);
				this.unbind("reorder", this._updateBarOrder);
				this.detach(this._pbLowerBlock);
				this.detach(this._pbHigherBlock);
				this._pbLowerBlock.destroy();
				this._pbHigherBlock.destroy();
			}
		});

		return this;
	}
});