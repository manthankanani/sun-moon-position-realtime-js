// geolocation.online.sat.calc

// Geolocation with HTML 5 and Google Maps API based on example from maxheapsize: http://maxheapsize.com/2009/04/11/getting-the-browsers-geolocation-with-html-5/
//
// This script is by Merge Database and Design, http://merged.ca/ -- if you use some, all, or any of this code, please offer a return link.

var map;
var mapCenter
var geocoder;
var fakeLatitude;
var fakeLongitude;
var address_found, global_latitude, global_longitude, zoomlevel




function SetGeoLocCookie() {


	var Lat, Lon, LatDir, LonDir, CookieValue
	var SitePosCurrentIndex, SatNameCurrentIndex
	var Calibrate_pulsevalue, Calibrate_pulse_per_ha_degree, calibrate_inc_direction, HeightAboveOcean

	var cookie11, cookie12, cookie13, cookie14, cookie15, cookie16, cookie17, cookie18, cookie19, cookie20
	var ValArray = new Array();
	var SubArray = new Array();
	MyCookieVal = document.cookie;


	if (MyCookieVal !== "") // If cookie has value then set users defaults
	{

		ValArray = MyCookieVal.split(":"); //' Reads 6 cookie values in to the array    
		cookie12 = ValArray[12];
		cookie13 = ValArray[13];
		cookie14 = ValArray[14];
		//cookie15=ValArray[15];
		cookie16 = ValArray[16];
		cookie17 = ValArray[17];
		cookie18 = ValArray[18];
		cookie19 = ValArray[19];
		cookie20 = ValArray[20];
	} //else alert("No Cookie stored");


	//address_found=address.address; 
	if (global_latitude < 0) LatDir = "South"
	else LatDir = "North";
	if (global_longitude < 0) LonDir = "West"
	else LonDir = "East";

	Lat = 1 * Math.abs(global_latitude);
	Lon = 1 * Math.abs(global_longitude);


	cookie15 = address_found;

	zoomlevel = map.getZoom();
	document.getElementById('zoom_level').innerHTML = zoomlevel;

	CookieValue = Lat + ":" + LatDir + ":" + Lon + ":" + LonDir + ":" + ValArray[4] + ":" + ValArray[5] + ":" + ValArray[6] + ":" + ValArray[7] + ":" + ValArray[8] + ":" + ValArray[9] + ":" + ValArray[10] + ":" + ValArray[11] + ":" + cookie12 + ":" + cookie13 + ":" + cookie14 + ":" + cookie15 + ":" + cookie16 + ":" + cookie17 + ":" + cookie19 + ":" + cookie20 + ";expires=Tue, 10 Jul 2040 23:59:59 UTC;";
	deleteAllCookies();
	//alert(address_found);
	document.cookie = CookieValue; // Store cookie



	ReadCookie(); // for lookangles
	CalculateAngles(); // for lookangles
}


function initialize() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

				// Did we get the position correctly?
				// alert (position.coords.latitude);

				// To see everything available in the position.coords array:
				// for (key in position.coords) {alert(key)}

				mapServiceProvider(position.coords.latitude, position.coords.longitude);


			}, // next function is the error callback
			function(error) {
				switch (error.code) {
					case error.TIMEOUT:
						alert('Timeout');
						break;
					case error.POSITION_UNAVAILABLE:
						alert('Position unavailable');
						break;
					case error.PERMISSION_DENIED:
						alert('Permission denied');
						break;
					case error.UNKNOWN_ERROR:
						alert('Unknown error');
						break;
				}
			}
		);



	} else {
		alert("Geolocation services are not supported by your browser !");

		//  fakeLatitude = 49.273677;
		//  fakeLongitude = -123.114420;

		//alert(fakeLatitude+', '+fakeLongitude);     
		//  mapServiceProvider(fakeLatitude,fakeLongitude);
	}
}

function mapServiceProvider(latitude, longitude) {
	if (window.location.querystring['serviceProvider'] == 'Yahoo') {
		mapThisYahoo(latitude, longitude);
	} else {
		mapThisGoogle(latitude, longitude);
	}
}

function mapThisYahoo(latitude, longitude) {
	var map = new YMap(document.getElementById('map'));
	map.addTypeControl();
	map.setMapType(YAHOO_MAP_REG);
	map.drawZoomAndCenter(latitude + ',' + longitude, 3);

	// add marker
	var currentGeoPoint = new YGeoPoint(latitude, longitude);
	map.addMarker(currentGeoPoint);

	// Start up a new reverse geocoder for addresses?
	// YAHOO Ajax/JS/Rest API does not yet support reverse geocoding (though they do support it via Actionscript... lame)
	// So we'll have to use Google for the reverse geocoding anyway, though I've left this part of the script just in case Yahoo! does support it and I'm not aware of it yet
	geocoder = new GClientGeocoder();
	geocoder.getLocations(latitude + ',' + longitude, addAddressToMap);
}


function posclicked(lat, lon) {

	var thispoint = new GLatLng(lat, lon);
	if (thispoint) {
		geocoder.getLocations(thispoint, function(addresses) {
			if (addresses.Status.code != 200) {
				// alert("reverse geocoder failed to find an address for " + thispoint.toUrlValue());
				// document.output.address_2.value="Not found";
				document.getElementById('selected_address').innerHTML = "Not found";
				document.getElementById('lngspan').innerHTML = thispoint.lng();
				document.getElementById('latspan').innerHTML = thispoint.lat();

				address_found = "Not found";
				global_latitude = thispoint.lat();
				global_longitude = thispoint.lng();
				SetGeoLocCookie();
				CalculateCoordinate();
				document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
				map.openInfoWindow(thispoint, "Selected location:<br>" + thispoint.lat() + " , " + thispoint.lng());
			} else {
				address = addresses.Placemark[0];
				// document.output.address_2.value=address.address; 
				document.getElementById('selected_address').innerHTML = address.address;
				var myHtml = address.address + "<br>Selected location:<br>" + thispoint.lat() + " , " + thispoint.lng();
				document.getElementById('lngspan').innerHTML = thispoint.lng();
				document.getElementById('latspan').innerHTML = thispoint.lat();
				address_found = address.address;
				global_latitude = thispoint.lat();
				global_longitude = thispoint.lng();
				SetGeoLocCookie();
				CalculateCoordinate();
				document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
				map.openInfoWindow(thispoint, myHtml);
			}
		});
	}
}


function mapThisGoogle(latitude, longitude) {
	var mapCenter = new GLatLng(latitude, longitude);
	map = new GMap2(document.getElementById("map"));
	//map.addControl(new GSmallMapControl());
	map.addControl(new GLargeMapControl());
	map.addControl(new GMapTypeControl());
	map.setCenter(mapCenter, 13);
	map.enableScrollWheelZoom();
	//map.addOverlay(new GMarker(mapCenter));




	// Start up a new reverse geocoder for addresses?
	geocoder = new GClientGeocoder();
	geocoder.getLocations(latitude + ',' + longitude, addAddressToMap);
	//  document.output.sellat.value=latitude;
	//document.output.sellon.value=longitude;
	document.getElementById('latlong').innerHTML = latitude + ', ' + longitude;
	document.getElementById('lngspan').innerHTML = longitude;
	document.getElementById('latspan').innerHTML = latitude;


	//  address_found=address.address;
	global_latitude = latitude;
	global_longitude = longitude;


	posclicked(latitude, longitude);




}

function addAddressToMap(response) {
	if (!response || response.Status.code != 200) {
		alert("Sorry, we were unable to geocode that address");
	} else {
		place = response.Placemark[0];
		$('#address').html('Your address: ' + place.address);
	}
}

window.location.querystring = (function() {

	// by Chris O'Brien, prettycode.org
	var collection = {};
	var querystring = window.location.search;
	if (!querystring) {
		return {
			toString: function() {
				return "";
			}
		};
	}
	querystring = decodeURI(querystring.substring(1));

	var pairs = querystring.split("&");

	for (var i = 0; i < pairs.length; i++) {

		if (!pairs[i]) {
			continue;
		}
		var seperatorPosition = pairs[i].indexOf("=");

		if (seperatorPosition == -1) {
			collection[pairs[i]] = "";
		} else {
			collection[pairs[i].substring(0, seperatorPosition)] = pairs[i].substr(seperatorPosition + 1);
		}
	}

	collection.toString = function() {
		return "?" + querystring;
	};

	return collection;
})();
