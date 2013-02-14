define(['async', 'googlemaps', 'maps', 'async!https://maps.googleapis.com/maps/api/js?sensor=false'],function(){
	app.map = new Googlemap({
		el : $('#map'),
		options : {
			streetViewControl : false,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			}
		}
	});

	app.venues.on('updateMarker', function(e, data){
		app.map.updateMarker(data.loc, data.marker);
	});
});