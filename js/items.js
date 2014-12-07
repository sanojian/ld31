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
