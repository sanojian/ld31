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
