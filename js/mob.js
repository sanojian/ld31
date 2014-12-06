/**
 * Created by jonas on 12/6/2014.
 */

Crafty.c('MOB', {
	direction: { x: 0, y: 0 },

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
			.bind('Moved', function(from) {
				if (this.hit('impassible')) {
					this.attr({ x: from.x, y: from.y });
				}
				else {
					this.attr({ z: (this.y + this.h) * 10 + 5 });

				}
				//this.doMove(this.x - from.x, this.y - from.y);
			});


		return this;
	},
	doMove: function(dx, dy) {
		if (this.direction.x == dx && this.direction.y == dy) {
			return;
		}
		this.direction.x = dx;
		this.direction.y = dy;
		if (dx > 0) {
			this.unflip();
		}
		else {
			this.flip();
		}
		if (dx === 0 && dy === 0) {
			this.pauseAnimation().resetAnimation();
		}
		else {
			this.animate('Walk', -1);
		}
	}

});
