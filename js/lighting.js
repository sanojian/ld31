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
		this.delay(function() { self.doFlicker(); }, 100 + 200 * Math.random());
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

		// ground illuminate
		/*ctx.globalCompositeOperation = "lighter";
		radgrad = ctx.createRadialGradient(this.x + this.radius, this.y + this.radius + 8, this.radius/16, this.x + this.radius, this.y + this.radius + 8, this.radius/6);
		radgrad.addColorStop(0, 'rgba(' + this.color + ',' + (this.flicker/2).toFixed(2) + ')');
		radgrad.addColorStop(1, 'rgba(' + this.color + ',0)');

		ctx.fillStyle = radgrad;

		var	cx = this.x + this.radius;
		var cy = this.y + this.radius + 8;
		var w = this.radius/2;
		var h = this.radius/4;

		ctx.beginPath();
		ctx.moveTo(cx, cy - h/2); // A1
		ctx.bezierCurveTo(
				cx + w/2, cy - h/2, // C1
				cx + w/2, cy + h/2, // C2
			cx, cy + h/2); // A2

		ctx.bezierCurveTo(
				cx - w/2, cy + h/2, // C3
				cx - w/2, cy - h/2, // C4
			cx, cy - h/2); // A1
		ctx.closePath();
		ctx.fill();*/

		// back to default
		Crafty.canvas.context.globalCompositeOperation = "source-over";
	}
});
