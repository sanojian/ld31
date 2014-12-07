/**
 * Created by jonas on 12/6/2014.
 */

Crafty.c('NPC', {
	mySpeed: 1,
	//direction: { x: 0, y: 0},

	NPC: function() {
		this.requires('MOB, Delay')
			.bind("EnterFrame", function (frameObj) {
				var newDir;
				if (this.direction.x || this.direction.y) {
					var from = { x: this.x, y: this.y };
					this.attr( { x: this.x + this.direction.x * this.mySpeed, y: this.y + this.direction.y * this.mySpeed } );
					this.trigger('Moved', from);
				}
				if (this.lighter && (frameObj.frame + this.randomizer) % 100 === 0) {
					// follow player
					newDir = { x: 0, y: 0 };
					var dx =  g_game.player.x - this.x;
					var dy = g_game.player.y - this.y;
					if (dx !== 0) {
						newDir.x = Math.abs(dx)/dx;
					}
					if (dy !== 0) {
						newDir.y = Math.abs(dy)/dy;
					}
					this.trigger('NewDirection', newDir);
					this.speak('I get you');
				}
				else if (!this.lighter && (frameObj.frame + this.randomizer) % 100 === 0) {
					newDir = { x: 0, y: 0 };
					newDir.x = -1 + Math.floor(Math.random() * 3);
					newDir.y = -1 + Math.floor(Math.random() * 3);
					this.trigger('NewDirection', newDir);
					this.speak('Dis way now');
				}
				if (this.hit('player')) {
					if (g_game.player.jump && g_game.player.jump.h > 4) {
						return;
					}
					else {
						loseGame('The orc got you!');
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

		return this;
	},
	speak: function(text) {
		this.speech.text(text).attr({ x: this.x + this.w/2 - this.speech.w/2 });
		this.delay(function() {
			this.speech.text('');
		}, 150 * text.length);
	}
});
