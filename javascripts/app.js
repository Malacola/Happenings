$(function() {
	var map = new L.Map('map'),
		tiles = new L.TileLayer('http://a.tiles.mapbox.com/v3/bobbysud.map-94xylfrd/{z}/{x}/{y}.png', {maxZoom: 17}),
		photoLayer = new L.LayerGroup(),
		searchRadius = new L.LayerGroup(),
		clientId = 'f62cd3b9e9a54a8fb18f7e122abc52df',
		searchPin = new L.Marker(new L.LatLng(37.790794553924414, -122.44709014892578), {draggable: true});

	// Add zoom out button
	$('<div>zoom out</div>')
	  .addClass('zoom-out')
	  .attr('title', 'See somewhere other than San Francisco, the map demo capital of the world.')
	  .click(function() {
	    map.setView(new L.LatLng(40.84706035607122, -94.482421875), 4);
	  })
	  .appendTo($('#map'));

	searchPin.addEventListener('dragend', onMarkerDragEnd);
	searchPin.setLatLng(new L.LatLng(37.790794553924414, -122.44709014892578));

	map.setView(new L.LatLng(37.790794553924414, -122.44709014892578), 13);

	map.addLayer(tiles)
	   .addLayer(photoLayer)
	   .addLayer(searchPin)
	   .addLayer(searchRadius);

	function onLocationFound(e){
		searchPin.setLatLng(e.target._latlng);
		findPhotos(e.latlng);
	}

	function onMarkerDragEnd(e){
		findPhotos(e.target._latlng);
		searchRadius.clearLayers();
		var radius = new L.Circle(e.target._latlng, 2000, {
			color: '#919191',
			fill: true,
			fillOpacity: 0.2,
			weight: 0
		});

		searchRadius.addLayer(radius);
	}

	function findPhotos(latlng){
		$().instagram({
	    	search: {
	    		lat: latlng.lat.toFixed(2),
	    		lng: latlng.lng.toFixed(2)
	    	},
	    	clientId: clientId,
	    	onComplete: plotPhotos
	    });
	}

	function plotPhotos(photos){
		photoLayer.clearLayers();

		_.each(photos, function(photo) {
			if (photo.location)
			{
				var object =  new L.CircleMarker(new L.LatLng(photo.location.latitude, photo.location.longitude), {
					radius: 5
				});
				
				var photoTemplate = _.template($("#popupTemplate").html(), {photo: photo});
				object.bindPopup(photoTemplate);
				photoLayer.addLayer(object);
			}
		});
	}

});