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
