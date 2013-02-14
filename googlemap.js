var Googlemap = Fidel.declare({
	defaults : {
		coord : /\d+\.\d+/,
		coords : [],
		fitBoundsMin : 5,
		markers : [],
		options : {},
		zoom : 14
	},
	elements : {
		address1 : '#address1',
		address2 : '#address2',
		citystatezip : '#citystatezip',
		latitude : '#latitude',
		longitude : '#longitude'
	},
	init : function() {
		if(!this.el) return new Error('El is required on instantiation. Pass el with a jquery node to your constructor options.');

		var self = this;

		this.elements.container = this.el[0].id;
		this.buildOptions();

		google.maps.event.addDomListener(window, 'load', function(){
			self.setSingleLatLng(function(){
				self.renderMap();
			});
		});
	},
	buildOptions : function() {
		for (var prop in this.options) {
			this.defaults.options[prop] = this.options[prop];
		}

		this.defaults.options.mapTypeId = this.options.mapTypeId || google.maps.MapTypeId.ROADMAP;
		this.defaults.options.zoom = this.options.zoom || this.defaults.zoom;
	},
	centerMap : function() {
		var self = this,
			bounds = new google.maps.LatLngBounds(),
			length = this.defaults.coords.length;

		for (var i = length - 1; i >= 0; i--) {
			bounds.extend(self.coords[i]);
		}

		this.defaults.map.setCenter(bounds.getCenter());

		if(length >= this.defaults.fitBoundsMin)
			this.defaults.map.fitBounds(bounds);
	},
	geoCodeByAddress : function(address, callback) {
		var gc = new google.maps.Geocoder();

		gc.geocode({ 'address' : address }, function(result, status){
			if(status === google.maps.GeocoderStatus.OK)
				callback(result[0].geometry.location);
			else
				throw new Error('Geocode for ' + address + ' was not found : ' + status);
		});
	},
	latLng : function(coords, callback) {
		return callback(new google.maps.LatLng(coords[0], coords[1]));
	},
	renderMap : function(coord) {
		this.defaults.map = new google.maps.Map(document.getElementById(this.elements.container), this.defaults.options);
		this.setMarkers();
		this.centerMap();
	},
	setSingleLatLng : function(callback) {
		var self = this,
			el = this.elements,
			latitude = $.trim($(el.latitude).text()),
			longitude = $.trim($(el.longitude).text()),
			address1 = $.trim($(el.address1).text()),
			address2 = $.trim($(el.address2).text()),
			citystatezip = $.trim($(el.citystatezip).text());

		if(address1 != '' && citystatezip != '') {
			this.geoCodeByAddress(address1 + ' ' + address2 + ' ' + citystatezip, function(obj){
				self.defaults.coords.push(new google.maps.LatLng(obj.Ya, obj.Za));
				callback();
			});
		} else {
			self.defaults.coords.push(new google.maps.LatLng(latitude, longitude));
			callback();
		}
	},
	setMarkers : function() {
		var self = this;

		for (var i = this.defaults.coords.length - 1; i >= 0; i--) {
			var marker = new google.maps.Marker({
				map: this.defaults.map,
				position: this.defaults.coords[i]
			});

			google.maps.event.addListener(marker, 'position_changed', function(){
				self.centerMap();
			});

			this.defaults.markers.push(marker);
		};
	},
	updateMarker : function(location, marker) {
		var self = this,
			marker = (marker !== 'undefined') ? marker : 0;

		if(this.defaults.coord.test(location[0])) {
			this.latLng(location, function(res){
				self.coords.splice(marker, 1, res);
				self.defaults.markers[marker].setPosition(res);
			});
		} else {
			this.geoCodeByAddress(location.join(' '), function(res){
				self.latLng([res.Ya, res.Za], function(obj){
					self.coords.splice(marker, 1, obj);
					self.defaults.markers[marker].setPosition(obj);
				});
			});
		}
	}
});