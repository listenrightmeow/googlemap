# Googlemap
----
A controller for Google Maps V3 javascript API

## Demo

Sorry, no demo yet.

## Requirements

This example utilizes [Fidel](https://github.com/jgallen23/fidel) and requires JQuery.
Googlemap can easily be changed to support [Backbone](http://backbonejs.org/) or [Simple Javascript Inheritance by John Resig](http://ejohn.org/blog/simple-javascript-inheritance/)

## Constructor
``` js
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
```

## Hooks
``` js
	app.venues.on('updateMarker', function(e, data){
		app.map.updateMarker(data.loc, data.marker);
	});
```

## Requirements

A JQuery element is required on instantiation.

## Options

None as of yet. Since this is a young project, this repo will be built on over time.