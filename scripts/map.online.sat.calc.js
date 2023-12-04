// map.online.sat.calc
var map;
var map2;
var geocoder = null;
var addressMarker;
var navn;
var address_found, global_latitude, global_longitude
var zoomlevel
function SetGoogleMapCookie() {
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
		cookie16 = map.getZoom();
		cookie17 = ValArray[17];
		cookie18 = ValArray[18];
		cookie19 = ValArray[19];
		cookie20 = ValArray[20];
	} //else alert("No Cookie stored");
	zoomlevel = map.getZoom();
	//alert("Store cookie"+zoomlevel);
	//address_found=address.address; 
	if (global_latitude < 0) LatDir = "South"
	else LatDir = "North";
	if (global_longitude < 0) LonDir = "West"
	else LonDir = "East";
	Lat = 1 * Math.abs(global_latitude);
	Lon = 1 * Math.abs(global_longitude);
	cookie15 = address_found;
	CookieValue = Lat + ":" + LatDir + ":" + Lon + ":" + LonDir + ":" + ValArray[4] + ":" + ValArray[5] + ":" + ValArray[6] + ":" + ValArray[7] + ":" + ValArray[8] + ":" + ValArray[9] + ":" + ValArray[10] + ":" + ValArray[11] + ":" + cookie12 + ":" + cookie13 + ":" + cookie14 + ":" + cookie15 + ":" + cookie16 + ":" + cookie17 + ":" + cookie19 + ":" + cookie20 + ";expires=Tue, 10 Jul 2040 23:59:59 UTC;";
	deleteAllCookies();
	//alert(address_found);
	document.cookie = CookieValue; // Store cookie
	ReadCookie(); // for lookangles
	//alert(map.getZoom());
}
function SetGoogleMapZoomCookie(zoomlevel) {
	var CookieValue
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
		cookie15 = ValArray[15];
		cookie16 = zoomlevel;
		cookie17 = ValArray[17];
		cookie18 = ValArray[18];
		cookie19 = ValArray[19];
		cookie20 = ValArray[20];
	} //else alert("No Cookie stored");
	//zoomlevel=map.getZoom();
	CookieValue = ValArray[0] + ":" + ValArray[1] + ":" + ValArray[2] + ":" + ValArray[3] + ":" + ValArray[4] + ":" + ValArray[5] + ":" + ValArray[6] + ":" + ValArray[7] + ":" + ValArray[8] + ":" + ValArray[9] + ":" + ValArray[10] + ":" + ValArray[11] + ":" + cookie12 + ":" + cookie13 + ":" + cookie14 + ":" + cookie15 + ":" + cookie16 + ":" + cookie17 + ":" + cookie19 + ":" + cookie20 + ";expires=Tue, 10 Jul 2040 23:59:59 UTC;";
	deleteAllCookies();
	document.cookie = CookieValue; // Store cookie
}
function clicked(overlay, latlng) {
	if (latlng) {
		geocoder.getLocations(latlng, function(addresses) {
			if (addresses.Status.code != 200) {
				// alert("reverse geocoder failed to find an address for " + latlng.toUrlValue());
				// document.output.address_2.value="Not found";
				document.getElementById('selected_address').innerHTML = "Not found";
				map.openInfoWindow(latlng, "Selected location:<br>" + latlng.lat() + " , " + latlng.lng());
				address_found = "Not found";
				global_latitude = latlng.lat();
				global_longitude = latlng.lng();
				document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
				CalculateCoordinate();
				SetGoogleMapCookie();
			} else {
				address = addresses.Placemark[0];
				//  document.output.address_2.value=address.address; 
				document.getElementById('selected_address').innerHTML = address.address;
				address_found = address.address;
				global_latitude = latlng.lat();
				global_longitude = latlng.lng();
				SetGoogleMapCookie();
				var myHtml = address.address + "<br>Selected location:<br>" + latlng.lat() + " , " + latlng.lng();
				map.openInfoWindow(latlng, myHtml);
				document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
				CalculateCoordinate();
				SetGoogleMapCookie();
			}
		});
	}
}
function markposfromadress(lat, lon) {
	var thispoint = new GLatLng(lat, lon);
	if (thispoint) {
		geocoder.getLocations(thispoint, function(addresses) {
			if (addresses.Status.code != 200) {
				// alert("reverse geocoder failed to find an address for " + thispoint.toUrlValue());
				//document.output.address_2.value="Not found";
				document.getElementById('selected_address').innerHTML = "Not found";
				document.getElementById('lngspan').innerHTML = thispoint.lng();
				document.getElementById('latspan').innerHTML = thispoint.lat();
				address_found = "Not found";
				SetGoogleMapCookie();
				global_latitude = thispoint.lat();
				global_longitude = thispoint.lng();
				CalculateCoordinate();
				map.openInfoWindow(thispoint, "Selected location:<br>" + thispoint.lat() + " , " + thispoint.lng());
			} else {
				address = addresses.Placemark[0];
				//document.output.address_2.value=address.address;  
				document.getElementById('selected_address').innerHTML = address.address;
				address_found = address.address;
				SetGoogleMapCookie();
				global_latitude = thispoint.lat();
				global_longitude = thispoint.lng();
				var myHtml = address.address + "<br>Selected location:<br>" + thispoint.lat() + " , " + thispoint.lng();
				CalculateCoordinate();
				map.openInfoWindow(thispoint, myHtml);
			}
		});
	}
}
function loadmarkposfromadress(lat, lon) {
	var thispoint = new GLatLng(lat, lon);
	if (thispoint) {
		geocoder.getLocations(thispoint, function(addresses) {
			if (addresses.Status.code != 200) {
				document.getElementById('selected_address').innerHTML = "Not found";
				document.getElementById('lngspan').innerHTML = thispoint.lng();
				document.getElementById('latspan').innerHTML = thispoint.lat();
				address_found = "Not found";
				map.openInfoWindow(thispoint, "Selected location:<br>" + thispoint.lat() + " , " + thispoint.lng());
			} else {
				address = addresses.Placemark[0];
				document.getElementById('selected_address').innerHTML = address.address;
				address_found = address.address;
				var myHtml = address.address + "<br>Selected location:<br>" + thispoint.lat() + " , " + thispoint.lng();
				map.openInfoWindow(thispoint, myHtml);
			}
		});
	}
}
function showAddress(address) {
	geocoder = new GClientGeocoder();
	if (geocoder) {
		geocoder.getLatLng(
			address,
			function(point) {
				if (!point) {
					alert("We're sorry but '" + address + "' cannot be found on Google Maps. Please try again.");
				} else {
					document.getElementById('latlong').innerHTML = point.lat() + ', ' + point.lng();
					document.getElementById('lngspan').innerHTML = point.lng();
					document.getElementById('latspan').innerHTML = point.lat();
					//address_found=address.address; 
					global_latitude = point.lat();
					global_longitude = point.lng();
					map.panTo(point);
					map.setCenter(point, 15);
					markposfromadress(point.lat(), point.lng());
					SetGoogleMapCookie();
					document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
					//ReadCookie();
					CalculateAngles(); // for lookangles
					zoomlevel = map.getZoom();
					document.getElementById('zoom_level').innerHTML = zoomlevel;
				}
			});
	}
}
function getposition() {
	//alert(12345);
	//map.setCenter(new GLatLng(37.4419, -122.1419), 14);
	map.enableScrollWheelZoom();
	//alert(map.getZoom()); 
	geocoder = new GClientGeocoder();
	//markposfromadress(point.lat(), point.lng());
	GEvent.addListener(map, "click", clicked);
	if (geocoder) {
		geocoder.getLatLng(
			address,
			function(point) {
				if (!point) {
					alert("We're sorry but '" + address + "' cannot be found on Google Maps. Please try again.");
				} else {
					map.panTo(point);
					alert(1234);
					document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
					CalculateAngles();
					global_latitude = point.lat();
					global_longitude = point.lng();
				}
			});
	}
	zoomlevel = map.getZoom();
	document.getElementById('zoom_level').innerHTML = zoomlevel;
	//SetGoogleMapCookie();
}
function clickroute(lati, long) {
	map.panTo(new google.maps.LatLng(lati, long));
	// map.setCenter(new GLatLng(lati, long), 10);
	return false; //this will cancel your navigation
}
function load() {
	var Lat, Lon, LatDir, LonDir, CookieValue, MyCookieVal, HightAboveOcean
	var ValArray = new Array();
	var SubArray = new Array();
	MyCookieVal = document.cookie;
	//alert(MyCookieVal);
	if (MyCookieVal !== "") // If cookie has value then set users defaults
	{
		ValArray = MyCookieVal.split(":"); //' Reads 6 cookie values in to the array    
		Lat = ValArray[0];
		LatDir = ValArray[1];
		Lon = ValArray[2];
		LonDir = ValArray[3];
		if (LatDir == "South") Lat = -1 * Lat
		else Lat = 1 * Lat;
		if (LonDir == "West") Lon = -1 * Lon
		else Lon = 1 * Lon;
		zoomlevel = ValArray[16];
		if ((isNaN(zoomlevel)) || (Lat == "undefined")) zoomlevel = 2
		else zoomlevel = ValArray[16];
		//alert(Lat+" "+Lon);
		//alert("Stored cookie "+ValArray[16]);
		document.getElementById('lngspan').innerHTML = Lon;
		document.getElementById('latspan').innerHTML = Lat;
		document.getElementById('latlong').innerHTML = Lat + ', ' + Lon;
		global_longitude = Lon;
		global_latitude = Lat;
		//alert(GBrowserIsCompatible());
		document.getElementById('zoom_level').innerHTML = zoomlevel;
		if (GBrowserIsCompatible()) {
			map = new GMap2(document.getElementById("map"));
			map.addControl(new GLargeMapControl());
			map.addControl(new GMapTypeControl());
			map.addControl(new GOverviewMapControl());
			map.setCenter(new GLatLng(33, -43), 2);
			//geocoder = new GClientGeocoder();
		}
		if (GBrowserIsCompatible()) {
			if ((isNaN(Lat)) || (Lat == "undefined") || (Math.abs(Lat) > 360) || (isNaN(Lon)) || (Lon == "undefined") || (Math.abs(Lon) > 360)) {
				alert("ok NaN undefined " + Lon + " " + Lat);
				map.setCenter(new GLatLng(33, -43), 2);
				document.getElementById('lngspan').innerHTML = -43;
				document.getElementById('latspan').innerHTML = 33;
				//alert("-43"+" "+"33");
				geocoder = new GClientGeocoder();
				loadmarkposfromadress(33, -43);
			} else {
				//alert("ok 1234 " +Lon+" "+Lat);
				// alert("Stored cookie "+ValArray[16]);
				map.setCenter(new GLatLng(Lat, Lon), zoomlevel);
				// map.setCenter(new GLatLng(Lat, Lon), 6);
				map.setZoom(1 * zoomlevel);
				document.getElementById('lngspan').innerHTML = Lon;
				document.getElementById('latspan').innerHTML = Lat;
				geocoder = new GClientGeocoder();
				var cookieposition = new GLatLng(Lat, Lon);
				var myHtml = ValArray[15] + "<br>Selected location:<br>" + cookieposition.lat() + " , " + cookieposition.lng();
				map.openInfoWindow(cookieposition, myHtml);
				//getposition();
				loadmarkposfromadress(Lat, Lon);
				//
				// alert(map.getZoom());
			}
		}
	} else {
		if (GBrowserIsCompatible()) {
			map = new GMap2(document.getElementById("map"));
			map.addControl(new GLargeMapControl());
			map.addControl(new GMapTypeControl());
			map.addControl(new GOverviewMapControl());
			map.setCenter(new GLatLng(33, -43), 2);
			//map.setZoom(1*ValArray[16]);
			document.getElementById('lngspan').innerHTML = -43;
			document.getElementById('latspan').innerHTML = 33;
		}
	}
	if (GBrowserIsCompatible()) {
		GEvent.addListener(map, 'click', function(overlay, point) {
			document.getElementById('latlong').innerHTML = point.lat() + ', ' + point.lng();
			//address_found=address.address; 
			global_latitude = point.lat();
			global_longitude = point.lng();
			//alert(1234);
			clickroute(point.lat(), point.lng());
			var latlng = new GLatLng(point.lat(), point.lng());
			SetGoogleMapCookie();
			document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
			CalculateAngles();
		});
	}
}
function loadfromlist(zoomlevel, Lati, Longi, LatDir, LonDir) {
	var Lat, Lon, LatDir, LonDir, CookieValue, MyCookieVal, HightAboveOcean
	var ValArray = new Array();
	var SubArray = new Array();
	SetGoogleMapZoomCookie(zoomlevel);
	MyCookieVal = document.cookie;
	//alert(MyCookieVal);
	Lat = Lati;
	Lon = Longi;
	if (LatDir == "South") Lat = -1 * Lat
	else Lat = 1 * Lat;
	if (LonDir == "West") Lon = -1 * Lon
	else Lon = 1 * Lon;
	document.getElementById('lngspan').innerHTML = Lon;
	document.getElementById('latspan').innerHTML = Lat;
	document.getElementById('latlong').innerHTML = Lat + ', ' + Lon;
	global_longitude = Lon;
	global_latitude = Lat;
	document.getElementById('zoom_level').innerHTML = zoomlevel;
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
		map.addControl(new GOverviewMapControl());
		map.setCenter(new GLatLng(Lat, Lon), 6);
		//geocoder = new GClientGeocoder();
		geocoder = new GClientGeocoder();
		var cookieposition = new GLatLng(Lat, Lon);
		var myHtml = ValArray[15] + "<br>Selected location:<br>" + cookieposition.lat() + " , " + cookieposition.lng();
		map.openInfoWindow(cookieposition, myHtml);
		//getposition();
		loadmarkposfromadress(Lat, Lon);
		GEvent.addListener(map, 'click', function(overlay, point) {
			document.getElementById('latlong').innerHTML = point.lat() + ', ' + point.lng();
			//address_found=address.address; 
			global_latitude = point.lat();
			global_longitude = point.lng();
			//alert(1234);
			clickroute(point.lat(), point.lng());
			var latlng = new GLatLng(point.lat(), point.lng());
			SetGoogleMapCookie();
			document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
			CalculateAngles();
		});
	}
	/*
	if (GBrowserIsCompatible()) 
		{
		if (    (isNaN(Lat))||(Lat=="undefined")||(Math.abs(Lat)>360)||(isNaN(Lon))||(Lon=="undefined")||(Math.abs(Lon)>360)   )
			{
			map.setCenter(new GLatLng(33,-130), 8);
		document.getElementById('lngspan').innerHTML = -43;
			document.getElementById('latspan').innerHTML = 33 ;
		//alert("-43"+" "+"33");
		geocoder = new GClientGeocoder();
				loadmarkposfromadress(33,-43);
		}
				else
				{
			   // alert("Stored cookie "+ValArray[16]);
			map.setCenter(new GLatLng(Lat, Lon), zoomlevel);
			   // map.setCenter(new GLatLng(Lat, Lon), 6);
				map.setZoom(zoomlevel);
		document.getElementById('lngspan').innerHTML = Lon;
			document.getElementById('latspan').innerHTML = Lat ;
		//alert("ok " +Lon+" "+Lat);
		geocoder = new GClientGeocoder();
				var cookieposition=new GLatLng(Lat, Lon);
				var myHtml =ValArray[15]+"<br>Selected location:<br>"+ cookieposition.lat()+" , "+cookieposition.lng();
				map.openInfoWindow(cookieposition, myHtml);
		//getposition();
			   loadmarkposfromadress(Lat,Lon);
		//
				// alert(map.getZoom());
			}
	   }
	   */
}
function oldloadfromlist(zoomlevel, Lati, Longi, LatDir, LonDir) {
	var Lat, Lon, LatDir, LonDir, CookieValue, MyCookieVal, HightAboveOcean
	var ValArray = new Array();
	var SubArray = new Array();
	SetGoogleMapZoomCookie(zoomlevel);
	MyCookieVal = document.cookie;
	//alert(MyCookieVal);
	Lat = Lati;
	Lon = Longi;
	if (LatDir == "South") Lat = -1 * Lat
	else Lat = 1 * Lat;
	if (LonDir == "West") Lon = -1 * Lon
	else Lon = 1 * Lon;
	if (MyCookieVal !== "") // If cookie has value then set users defaults
	{
		ValArray = MyCookieVal.split(":"); //' Reads 6 cookie values in to the array    
		// Lat=ValArray[0];
		// LatDir=ValArray[1];
		// Lon=ValArray[2];
		// LonDir=ValArray[3];
		// if (LatDir=="South") Lat=-1*Lat
		//      else Lat=1*Lat;
		// if (LonDir=="West") Lon=-1*Lon
		//     else Lon=1*Lon;
		document.getElementById('lngspan').innerHTML = Lon;
		document.getElementById('latspan').innerHTML = Lat;
		document.getElementById('latlong').innerHTML = Lat + ', ' + Lon;
		global_longitude = Lon;
		global_latitude = Lat;
		document.getElementById('zoom_level').innerHTML = zoomlevel;
		if (GBrowserIsCompatible()) {
			map = new GMap2(document.getElementById("map"));
			map.addControl(new GLargeMapControl());
			map.addControl(new GMapTypeControl());
			map.addControl(new GOverviewMapControl());
			map.setCenter(new GLatLng(33, -43), 2);
			//geocoder = new GClientGeocoder();
			GEvent.addListener(map, 'click', function(overlay, point) {
				document.getElementById('latlong').innerHTML = point.lat() + ', ' + point.lng();
				//address_found=address.address; 
				global_latitude = point.lat();
				global_longitude = point.lng();
				//alert(1234);
				clickroute(point.lat(), point.lng());
				var latlng = new GLatLng(point.lat(), point.lng());
				SetGoogleMapCookie();
				document.Magnetic.Variation.value = formatnumber(getMagneticDeclination(1, 1), 6);
				CalculateAngles();
			});
		}
		if (GBrowserIsCompatible()) {
			if ((isNaN(Lat)) || (Lat == "undefined") || (Math.abs(Lat) > 360) || (isNaN(Lon)) || (Lon == "undefined") || (Math.abs(Lon) > 360)) {
				map.setCenter(new GLatLng(33, -43), 2);
				document.getElementById('lngspan').innerHTML = -43;
				document.getElementById('latspan').innerHTML = 33;
				//alert("-43"+" "+"33");
				geocoder = new GClientGeocoder();
				loadmarkposfromadress(33, -43);
			} else {
				// alert("Stored cookie "+ValArray[16]);
				map.setCenter(new GLatLng(Lat, Lon), zoomlevel);
				// map.setCenter(new GLatLng(Lat, Lon), 6);
				map.setZoom(zoomlevel);
				document.getElementById('lngspan').innerHTML = Lon;
				document.getElementById('latspan').innerHTML = Lat;
				//alert("ok " +Lon+" "+Lat);
				geocoder = new GClientGeocoder();
				var cookieposition = new GLatLng(Lat, Lon);
				var myHtml = ValArray[15] + "<br>Selected location:<br>" + cookieposition.lat() + " , " + cookieposition.lng();
				map.openInfoWindow(cookieposition, myHtml);
				//getposition();
				loadmarkposfromadress(Lat, Lon);
				//
				// alert(map.getZoom());
			}
		}
	} else {
		if (GBrowserIsCompatible()) {
			map = new GMap2(document.getElementById("map"));
			map.addControl(new GLargeMapControl());
			map.addControl(new GMapTypeControl());
			map.addControl(new GOverviewMapControl());
			map.setCenter(new GLatLng(33, -43), 2);
			//map.setZoom(1*ValArray[16]);
			document.getElementById('lngspan').innerHTML = -43;
			document.getElementById('latspan').innerHTML = 33;
		}
	}
}
function oldload() {
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
		map.setCenter(new GLatLng(34, -39), 2);
		document.getElementById('lngspan').innerHTML = 34;
		document.getElementById('latspan').innerHTML = -39;
		// getposition();
		geocoder = new GClientGeocoder();
	}
}
function onmousemoveinmap(thismap) {
	GEvent.addListener(map, 'mousemove', function(point) {
		document.getElementById('lngspan').innerHTML = point.lng();
		document.getElementById('latspan').innerHTML = point.lat();
	});
	zoomlevel = map.getZoom();
	document.getElementById('zoom_level').innerHTML = zoomlevel;
	//SetGoogleMapCookie(); 
	SetGoogleMapZoomCookie(zoomlevel);
}