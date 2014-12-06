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
			.bind('EnterFrame', function(evt) {
				this.frames = evt.frame;

				this.lighter.attr({ x: this.x - this.lighter.radius + this.w/2, y: this.y - this.lighter.radius + 7*this.h/8, z: this.z - 20 });
				//Crafty.viewport.x = VIEW_WIDTH/2 - this.x;
				//Crafty.viewport.y = VIEW_HEIGHT/2 - this.y;

				if (g_game.needRedrawDarkness) {
					// darkness
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

			})
			.MOB();

		this.lighter = Crafty.e('2D, Canvas, LightSource').LightSource(this, 128, '255,255,128');

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