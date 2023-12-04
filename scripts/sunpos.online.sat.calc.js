// sunpos.online.sat.calc
var suncalc_updated
var HA_for_calibrated_position, SetLocation
var Calibrate_pulsevalue, Calibrate_pulse_per_ha_degree, calibrate_inc_direction, SatNameCurrentIndex
var output_angles = new Array()
var output_moon_angles = new Array()
var autoupdate, SatLon, autoprintupdate
autoupdate = 0;
autoprintupdate = 0;
suncalc_updated = "<font color=\"#000000\" size=\"2\" face=\"Trebuchet MS\">Calculator script updated 30-12-2012 16:33 UTC<br></font>";
html_suncalc_updated = "<p align='center'><font color='#000000' size='2' face='Trebuchet MS'><br>Updated 30 December 2012</font>";
//window.setInterval CalculateAngles(),5000
//window.setInterval "update()",1000,JavaScript
function printupdate() {
	if (autoprintupdate == 1)
		autoprintupdate = 0
	else
		autoprintupdate = 1;
}
function update() {
	if (autoupdate == 0) {
		window.setInterval("AutoCalculateAngles()", 1000);
	} else {
		//window.setInterval("CalculateAngles()", 0); 
		//autoupdate=1;
	}
	if (autoupdate == 1) autoupdate = 0
	else
		autoupdate = 1;
}
function date_and_time() {
	date_and_time = Date();
	//alert(Date());
}
function ShowCredit() {
	var credittext
	credittext = "First uploaded 05032006   "
	credittext = credittext + "\nProgrammed by Jens T. Satre"
	credittext = credittext + "\nScript for sun position calculations"
	credittext = credittext + "\n3012-2012: Minor changes for hourangle formatting"
	credittext = credittext + "\n2912-2012: Fixed error - missing Sun hourangle"
	credittext = credittext + "\n2912-2012: Changed hourangle to be displayed as positive/negative value. Negative for direction west"
	credittext = credittext + "\n2812-2012: Added output of Moons current Earth Latitude/Longitude"
	credittext = credittext + "\n2812-2012: Added output of Moons Topocentric RA and declination"
	credittext = credittext + "\n2812-2012: Added output of Suns current Earth Latitude/Longitude"
	credittext = credittext + "\n0508-2012: Added output of Moon&Sun hourangle"
	credittext = credittext + "\n0605-2012: Added google map and geolocation"
	credittext = credittext + "\n0105-2008: Corrected error in Azimuth for southern hemisphere(reported by MetService New Zealand)"
	credittext = credittext + "\n2904-2008: Corrected error in UTC date display(reported by MetService New Zealand)"
	credittext = credittext + "\n0203-2008: Iterations fix hopefully prevents a problem with script running slow"
	credittext = credittext + "\n0203-2008: Fixes for eccentric anomaly iterations for the moon (higher accuracy)"
	credittext = credittext + "\n0410-2006: Small fix: Moon Geometric Elevation and Moon Elevation (atmospheric refraction)"
	credittext = credittext + "\n0210-2006: Display satellite longitude which gives same azimuth as the Moon"
	credittext = credittext + "\n0210-2006: Moon elevation(altitude) corrected lunar parallelax(thanks to Paul Schlyter)"
	credittext = credittext + "\n0110-2006: Added Moon position (Moon elevation accuracy is not good at the moment)"
	credittext = credittext + "\n0603-2006: Display satellite longitude which gives same azimuth as the sun"
	credittext = credittext + "\n0603-2006: Display Sun Elevation with and without atmospheric refraction"
	credittext = credittext + "\n0503-2006: First version, Javascript"
	alert(credittext);
}
function AutoCalculateAngles() {
	if (autoupdate == 1) {
		set_todays_date();
		CalculateAngles();
		if (autoprintupdate == 1) printresult();
	}
}
function getsatelliteposition(InputAzimuth) {
	var X, Y, Z, R, S, p, Azimuth, torad, tograd, SatteliteLon
	var return_array = new Array();
	pi = Math.PI;
	torad = pi / 180;
	tograd = 180 / pi;
	R = 6378.14; //' km
	S = 42164.57; //' km
	Lat = 1 * document.Latitude.Degrees.value;
	LatDir = document.Latitude.Direction.value;
	Lon = 1 * document.Longitude.Degrees.value;
	LonDir = document.Longitude.Direction.value;
	if (LatDir == "South") Lat = -Lat;
	if (LonDir == "West") Lon = 360 - Lon;
	Azimuth = 1 * document.Angles.SunAzimuth.value;
	Azimuth = InputAzimuth;
	Z = (Lon * pi / 180) - Math.atan(Math.tan(Azimuth * pi / 180) * Math.sin(Lat * pi / 180));
	Z = Rev(Z * 180 / pi);
	// for southern hemispheare azimuths between 270-360(0) and 0-90 means satellite is visible
	//if (  ((LatDir=="North") && (Azimuth>90) && (Azimuth<270)) || ( (LatDir=="South") &&  (   ((Azimuth>0) && (Azimuth<90)) && ((Azimuth>270) && Azimuth<360))  )       ) 
	if (((LatDir == "North") && (Azimuth > 90) && (Azimuth < 270)) || ((LatDir == "South") && (((Azimuth >= 0) && (Azimuth <= 90)) || ((Azimuth >= 270) && Azimuth <= 360)))) {
		if (Z < 0) {
			Z = 360 - Z;
			SatteliteLon = formatnumber(Z, 5) + "° West*";
			SatLon = Z;
		}
		if (Z > 0) {
			if (Z > 180) {
				Z = 360 - Z; // ' gir lav verdi for vest
				SatteliteLon = formatnumber(Z, 5) + "° West (" + formatnumber((360 - Z), 3) + "° East)";
				SatLon = -Z; //
			} else {
				SatteliteLon = formatnumber(Z, 5) + "° East";
				SatLon = Z;
			}
		} // end if Z>0
		//SatelliteElevation=tograd*atn(   (COS(Y-Z)*COS(X)-R/S)/SQRT(  SIN(Y-Z)*SIN(Y-Z)+ COS(Y-Z)*COS(Y-Z)*SIN(X)*SIN(X) )    )
		//document.Output.Satel.value=tograd*Z
		/*
		 */
	} // if latdir="North" etc...
	else {
		SatteliteLon = "Not Available";
	} //' if latdir="North" etc...
	return_array[0] = SatteliteLon;
	return_array[1] = SatLon;
	return (return_array);
}
function Elevation2(SatLon, SiteLat, SiteLon, Height_over_ocean) {
	var Rstation, f, r_eq, r_sat, Ra, Rz, alfa_r, alfa_rx, alfa_ry, refraction, alfa_rz, alfa_r_north, alfa_r_zenith, El_geometric, El_observed, Elevation
	var x, a0, a1, a2, a3, a4
	a0 = 0.58804392;
	a1 = -0.17941557
	a2 = 0.29906946E-1;
	a3 = -0.25187400E-2;
	a4 = 0.82622101E-4;
	f = (1 / 298.257); // Earth flattning factor
	r_sat = 42164.57; // Distance from earth centre to satellite
	r_eq = 6378.14; // Earth radius
	Rstation = r_eq / (Math.sqrt(1 - f * (2 - f) * Math.sin(Radians(SiteLat)) * Math.sin(Radians(SiteLat))));
	Ra = (Rstation + Height_over_ocean) * Math.cos(Radians(SiteLat));
	Rz = Rstation * (1 - f) * (1 - f) * Math.sin(Radians(SiteLat));
	alfa_r = r_sat - Rstation;
	alfa_rx = r_sat * Math.cos(Radians(SatLon - SiteLon)) - Ra;
	alfa_ry = r_sat * Math.sin(Radians(SatLon - SiteLon));
	alfa_rz = -Rz;
	alfa_r_north = -alfa_rx * Math.sin(Radians(SiteLat)) + alfa_rz * Math.cos(Radians(SiteLat));
	alfa_r_zenith = alfa_rx * Math.cos(Radians(SiteLat)) + alfa_rz * Math.sin(Radians(SiteLat));
	El_geometric = Deg(Math.atan2(alfa_r_zenith, Math.sqrt(alfa_r_north * alfa_r_north + alfa_ry * alfa_ry)));
	x = Math.abs(El_geometric + 0.589);
	refraction = Math.abs(a0 + a1 * x + a2 * x * x + a3 * x * x * x + a4 * x * x * x * x);
	if (El_geometric > 10.2) {
		El_observed = El_geometric + 0.01617 * (Math.cos(Radians(Math.abs(El_geometric))) / Math.sin(Radians(Math.abs(El_geometric))));
	} else {
		El_observed = El_geometric + refraction;
	}
	//if (alfa_r_zenith<-3000) El_observed=-99;
	return (El_observed);
}
function CalculateAngles() {
	var d, Day, Month, Year, Hour, Minute, Seconds
	var Lat, Lon, LatDir, LonDir, SunAltitude, ElevationDifference
	var Hourangle_direction_text, Latitude_direction_text
	var ephem_array = new Array();
	var MonSatLon, SunSatLon
	var MoonSatLonArray = new Array();
	var SunSatLonArray = new Array();
	SiteLat = 1 * document.Latitude.Degrees.value;
	LatDir = document.Latitude.Direction.value;
	SiteLon = 1 * document.Longitude.Degrees.value;
	LonDir = document.Longitude.Direction.value;
	if (LatDir == "South") SiteLat = -SiteLat;
	if (LonDir == "West") SiteLon = 360 - SiteLon;
	Day = 1 * document.TimeAndDate.Day.value;
	Month = 1 * document.TimeAndDate.Month.value;
	Year = 1 * document.TimeAndDate.Year.value;
	Hour = 1 * document.TimeAndDate.Hour.value;
	Minute = 1 * document.TimeAndDate.Minute.value;
	Seconds = 1 * document.TimeAndDate.Seconds.value;
	d = daynumber(Day, Month, Year, Hour, Minute, Seconds);
	output_angles = sun_angles(d, SiteLon, SiteLat);
	output_moon_angles = moon_angles(d, SiteLon, SiteLat);
	document.Angles.MoonLon.value = formatnumber(output_moon_angles[3], 3);
	document.Angles.MoonLat.value = formatnumber(output_moon_angles[11], 3);
	document.Angles.MoonRA.value = formatnumber(output_moon_angles[4], 3);
	document.Angles.MoonDecl.value = formatnumber(output_moon_angles[2], 3);
	document.Angles.MoonAz.value = formatnumber(output_moon_angles[1], 3);
	document.Angles.MoonDistance.value = formatnumber(output_moon_angles[13] * 6378.14, 3);
	document.Angles.MoonGeoEl.value = formatnumber(output_moon_angles[10], 3); // without atmospheric refraction
	document.Angles.MoonEl.value = formatnumber(output_moon_angles[12], 3); // with atmospheric refraction
	Hourangle_direction_text = '';
	if (output_moon_angles[21] < 0) Hourangle_direction_text = ' °E'
	else Hourangle_direction_text = ' °W';
	document.Angles.MoonHourangle.value = formatnumber(output_moon_angles[21], 3) + Hourangle_direction_text + ' (' + formatnumber(output_moon_angles[14], 3) + ')';
	if (1 * output_moon_angles[20] < 0) Latitude_direction_text = ' °S'
	else Latitude_direction_text = ' °N';
	if (output_moon_angles[22] < 0) Hourangle_direction_text = ' °E'
	else Hourangle_direction_text = ' °W';
	document.Angles.MoonGcHourangle.value = formatnumber(output_moon_angles[22], 3) + Hourangle_direction_text + ' (' + formatnumber(output_moon_angles[15], 3) + ')';
	document.Angles.TopMoonRA.value = formatnumber(1 * output_moon_angles[16], 3);
	document.Angles.TopMoonDecl.value = formatnumber(1 * output_moon_angles[17], 3);
	document.Angles.MoonGcLatitude.value = formatnumber(1 * output_moon_angles[20], 3) + Latitude_direction_text;
	document.Angles.MoonEarthLon.value = formatnumber(1 * output_moon_angles[19], 3) + '°E ( ' + formatnumber(360 - 1 * output_moon_angles[19], 3) + '°W )';
	/*
	angles[15]=gcHA;
	HourAngle
	angles[21]=HourAngle;
	angles[22]=((gcHA)*180/pi);
	angles[19]=EarthLon;
	angles[20]=EarthLat;
	angles[16]=topRA;
	angles[17]=topDecl;
	angles[18]=gclat;
	*/
	if (document.Angles.MoonGeoEl.value > -5)
		document.Angles.MoonEl.value = formatvalue(output_moon_angles[12], 5);
	else document.Angles.MoonEl.value = 'N/A'; //formatvalue(SunAltitude,5);
	SunAltitude = output_angles[0];
	document.Angles.SunAzimuth.value = formatvalue(output_angles[1], 8);
	/*
	angles[2]=Decl;
	angles[3]=sunlon;
	angles[4]=RA;
	angles[5]=Rev(GMST0);
	angles[6]=Rev(M);
	angles[7]=Rev(w);
	angles[8]=Rev(e);
	angles[9]=Rev(oblecl);
	*/
	document.Angles.SunDeclination.value = formatnumber(output_angles[2], 3);
	document.Angles.SunLongitude.value = formatnumber(output_angles[3], 3);
	document.Angles.RA.value = formatnumber(output_angles[4], 3);
	document.Angles.GMST0.value = formatnumber(output_angles[5], 3);
	document.Angles.MeanAnomaly.value = formatnumber(output_angles[6], 3);
	document.Angles.Perihelion.value = formatnumber(output_angles[7], 3);
	document.Angles.Eccentricity.value = formatnumber(output_angles[8], 3);
	document.Angles.Obliquity.value = formatnumber(output_angles[9], 3);
	document.Angles.SunGeometricElevation.value = formatnumber(output_angles[10], 3);
	Latitude_direction_text = '';
	Hourangle_direction_text = '';
	if (1 * output_angles[20] < 0) Latitude_direction_text = ' °S'
	else Latitude_direction_text = ' °N';
	if (output_angles[21] < 0) Hourangle_direction_text = ' °E'
	else Hourangle_direction_text = ' °W';
	document.Angles.SunHourangle.value = formatnumber(output_angles[21], 3) + Hourangle_direction_text + ' (' + formatnumber(output_angles[14], 3) + ')';
	document.Angles.SunEarthLongitude.value = formatnumber(output_angles[19], 3) + '°E ( ' + formatnumber((360 - output_angles[19]), 3) + '°W )';
	document.Angles.SunEarthLatitude.value = formatnumber(output_angles[20], 3) + Latitude_direction_text;
	if (document.Angles.SunGeometricElevation.value > -5)
		document.Angles.SunElevation.value = formatnumber(SunAltitude, 5);
	else document.Angles.SunElevation.value = 'N/A'; //formatvalue(SunAltitude,5);
	document.Angles.SatelliteLongitude.value = getsatelliteposition(output_angles[1]); // input azimuth
	SunSatLonArray = getsatelliteposition(output_angles[1]);
	document.Angles.SatelliteLongitude.value = SunSatLonArray[0];
	SunSatLon = SunSatLonArray[1] * 1;
	//alert(SunSatLon);
	if (document.Angles.SatelliteLongitude.value == "Not Available") {
		document.Angles.SatelliteElevation.value = "N/A";
		ElevationDifference = "N/A";
		//ElevationDifference=Math.abs(document.Angles.SunGeometricElevation.value-document.Angles.SatelliteElevation.value);
	} else {
		document.Angles.SatelliteElevation.value = formatnumber(Elevation2(SunSatLon, SiteLat, SiteLon, 0), 5);
		ElevationDifference = Math.abs(document.Angles.SunElevation.value - document.Angles.SatelliteElevation.value);
	}
	document.Angles.SunSatElDifference.value = formatnumber(ElevationDifference, 5);
	//MonSatLon=document.Angles.SatelliteLongitudeMoon.value;
	MoonLonArray = getsatelliteposition(output_moon_angles[1]); // input azimuth
	document.Angles.SatelliteLongitudeMoon.value = MoonLonArray[0];
	MonSatLon = MoonLonArray[1] * 1;
	//alert(MonSatLon);
	if (document.Angles.SatelliteLongitudeMoon.value == "Not Available") {
		document.Angles.SatelliteElevationMoon.value = "N/A";
		ElevationDifference = "N/A";
		//ElevationDifference=Math.abs(document.Angles.MoonGeoEl.value-document.Angles.SatelliteElevationMoon.value);
	} else {
		document.Angles.SatelliteElevationMoon.value = formatnumber(Elevation2(MonSatLon, SiteLat, SiteLon, 0), 5);
		ElevationDifference = Math.abs(document.Angles.MoonEl.value - document.Angles.SatelliteElevationMoon.value);
	}
	document.Angles.MoonSatElDifference.value = formatnumber(ElevationDifference, 5);
	//
}
function MoonEclipse() {
	// use timestep and calculate Moon Latitude.  If MoonLatitude = 0 the eclipse at satellite lon=moon Lon.
	// how can moon Latitude=0 be found without calculating minute for minute ...?
}
function printresult() {
	var listing, today, time_offset, Hour, Minute, Second, Month, Day, Year, UTCDateString, LTDateString, d
	today = new Date()
	Day = 1 * document.TimeAndDate.Day.value;
	Month = 1 * document.TimeAndDate.Month.value;
	Year = 1 * document.TimeAndDate.Year.value;
	Hour = 1 * document.TimeAndDate.Hour.value;
	Minute = 1 * document.TimeAndDate.Minute.value;
	Second = 1 * document.TimeAndDate.Seconds.value;
	d = daynumber(Day, Month, Year, Hour, Minute, Second);
	today = d_to_date_and_time(d); // get time from form
	time_offset = today.getTimezoneOffset();
	/*
	Hour= today.getUTCHours() ;
	Minute=today.getUTCMinutes() ;
	Second=today.getUTCSeconds() ;
	Month= today.getUTCMonth()+1;
	Day= today.getUTCDate() ;
	Year= today.getUTCFullYear();
	*/
	if (Hour < 10) Hour = "0" + Hour;
	if (Minute < 10) Minute = "0" + Minute;
	if (Second < 10) Second = "0" + Second;
	UTCDateString = Day + "/" + Month + "/" + Year + " " + Hour + ":" + Minute + ":" + Second + " UTC";
	Hour = today.getUTCHours();
	Minute = today.getUTCMinutes();
	Second = today.getUTCSeconds();
	Month = today.getUTCMonth() + 1;
	Day = today.getUTCDate();
	Year = today.getFullYear();
	//If (Year<1900) Year=Year+1900;  // Fix for Mozilla Firefox
	if (Hour < 10) Hour = "0" + Hour;
	if (Minute < 10) Minute = "0" + Minute;
	if (Second < 10) Second = "0" + Second;
	LTDateString = Day + "/" + Month + "/" + Year + " " + Hour + ":" + Minute + ":" + Second + " Local Time";
	listing = "<html>"
	listing += "<head>"
	listing += "<meta http-equiv=Content-Type>"
	listing += "<meta name=GENERATOR content=Microsoft FrontPage 4.0>"
	listing += "<title>Sun azimuth ~ Satellite Longitude</title>"
	listing += "</head>"
	listing += "<FONT SIZE=1>"
	listing += "<body>"
	listing += "<center><font size=+7 face=Arial>" + UTCDateString + "</font></center>"
	listing += "<center><font size=+7 face=Arial>" + LTDateString + "</font></center>"
	listing += "<center><font size=+7 face=Arial>****************************SUN************************************</font></center>";
	listing += "<center><font size=+7 face=Arial>Satellite Position:" + document.Angles.SatelliteLongitude.value + "</font></center>"
	listing += "<center><font size=+7 face=Arial>Sun/Satellite Azimuth:" + document.Angles.SunAzimuth.value + " °</font></center>"
	if (document.Angles.SunElevation.value == "N/A") listing += "<center><font size=+7 face=Arial>Sun Elevation:" + formatvalue(document.Angles.SunGeometricElevation.value, 7) + " °</font></center>"
	else listing += "<center><font size=+7 face=Arial>Sun Elevation:" + formatvalue(document.Angles.SunElevation.value, 7) + " °</font></center>"
	listing += "<center><font size=+7 face=Arial>Satellite Elevation:" + document.Angles.SatelliteElevation.value + " °</font></center>"
	listing += "<center><font size=+7 face=Arial>|Satellite Elevation-Sun Elevation|:" + document.Angles.SunSatElDifference.value + " °</font></center>";
	listing += "<center><font size=+7 face=Arial>***************************MOON***********************************</font></center>"
	listing += "<center><font size=+7 face=Arial>Satellite Position:" + document.Angles.SatelliteLongitudeMoon.value + "</font></center>"
	listing += "<center><font size=+7 face=Arial>Moon/Satellite Azimuth:" + formatvalue(document.Angles.MoonAz.value, 8) + " °</font></center>"
	listing += "<center><font size=+7 face=Arial>Satellite Elevation:" + formatvalue(document.Angles.SatelliteElevationMoon.value, 8) + " °</font></center>"
	if (document.Angles.MoonEl.value == "N/A") {
		listing += "<center><font size=+7 face=Arial>Moon Elevation:" + formatvalue(document.Angles.MoonGeoEl.value, 7) + " °</font></center>"
		listing += "<center><font size=+7 face=Arial>|Satellite Elevation-Moon Elevation|:" + formatvalue(document.Angles.MoonSatElDifference.value, 8) + " °</font></center>"
	} else {
		listing += "<center><font size=+7 face=Arial>Moon Elevation:" + formatvalue(document.Angles.MoonEl.value, 7) + " °</font></center>"
		listing += "<center><font size=+7 face=Arial>|Satellite Elevation-Moon Elevation|:" + formatvalue(document.Angles.MoonSatElDifference.value, 7) + " °</font></center>"
	}
	listing += "</html>"
	PrintWindow = window.open("", "Print_window")
	//PrintWindow =window.open("","Print_window","menubar=yes,status=yes,toolbar=yes,scrollbars=yes"); //height=800,width=1000
	PrintWindow.oldWindow = top
	//PrintWindow.document.write(document.Output.Satpos.value) 
	PrintWindow.document.write(listing)
	PrintWindow.document.close()
}
function CalculateCoordinate() {
	var degrees, minute, seconds, SiteLon, SiteLat
	SiteLat = 1 * document.Latitude.Degrees.value;
	SiteLon = 1 * document.Longitude.Degrees.value;
	degrees = Math.floor(SiteLat);
	minutes = Math.floor((SiteLat - degrees) * 60);
	seconds = Math.floor(((SiteLat - degrees) * 60 - minutes) * 60);
	document.Latitude.LatDegrees.value = degrees;
	document.Latitude.LatMinutes.value = minutes;
	document.Latitude.LatSeconds.value = seconds;
	degrees = Math.floor(SiteLon);
	minutes = Math.floor((SiteLon - degrees) * 60);
	seconds = Math.floor(((SiteLon - degrees) * 60 - minutes) * 60);
	document.Longitude.LonDegrees.value = degrees;
	document.Longitude.LonMinutes.value = minutes;
	document.Longitude.LonSeconds.value = seconds;
}
function CalculateLat() {
	var degrees, minutes, seconds, decimaldegrees
	degrees = 1 * document.Latitude.LatDegrees.value;
	minutes = 1 * document.Latitude.LatMinutes.value;
	seconds = 1 * document.Latitude.LatSeconds.value;
	decimaldegrees = degrees + (minutes / 60) + (seconds / (60 * 60));
	document.Latitude.Degrees.value = formatvalue(decimaldegrees, 6);
}
function CalculateLon() {
	var degrees, minutes, seconds, decimaldegrees
	degrees = 1 * document.Longitude.LonDegrees.value;
	minutes = 1 * document.Longitude.LonMinutes.value;
	seconds = 1 * document.Longitude.LonSeconds.value;
	decimaldegrees = degrees + (minutes / 60) + (seconds / (60 * 60));
	document.Longitude.Degrees.value = formatvalue(decimaldegrees, 6);
}
function formatnumber(num, places) {
	var strOP, i, decimals, newdecimals, integer, newstring, numcopy
	var ss = new Array()
	numcopy = num;
	var a = Math.pow(10, Math.abs(places) == places ? places : 2);
	strOP = String(Math.round(num * a) / a).replace(/^(\d)/, " $1");
	if (num < 0) strOP = " " + strOP; // put " " on negative numbers
	//num=parseFloat(strOP);  
	ss = strOP.split("."); //  split string by .   what about zero..?
	if ((num !== 0) && (ss.length > 1)) {
		decimals = ss[1];
		integer = ss[0];
		if (decimals.length < places) //  check str length after . and add zeroes if decimals shorter than places
		{
			var addzeroes = "0";
			for (i = 0; i < (places - decimals.length - 1); i++) {
				addzeroes += "0";
			}
			//01
			strOP = integer + "." + decimals + addzeroes;
		}
	} else // num= integer
	{
		decimals = "0";
		for (i = 0; i < places - 1; i++) {
			decimals += "0";
		}
		strOP = numcopy + "." + decimals;
	}
	if (numcopy >= 0) strOP = " " + strOP;
	return (strOP)
}
function set_todays_date() {
	var today, Day, Month, Year, Hour, Minute, Seconds
	today = new Date();
	Month = today.getUTCMonth() + 1;
	Day = today.getUTCDate();
	//Year= today.getUTCYear();
	Year = today.getUTCFullYear();
	Hour = today.getUTCHours();
	Minute = today.getUTCMinutes();
	Seconds = today.getUTCSeconds();
	//If (Year<1900) Year=Year+1900;  // Fix for Mozilla Firefox
	document.TimeAndDate.Day.value = Day;
	document.TimeAndDate.Month.value = Month;
	document.TimeAndDate.Year.value = Year;
	document.TimeAndDate.Hour.value = Hour;
	document.TimeAndDate.Minute.value = Minute;
	document.TimeAndDate.Seconds.value = Seconds;
	// used for testing with date 19/04/1990 00:00 utc
	/*
	document.TimeAndDate.Day.value=19;
	document.TimeAndDate.Month.value=4;
	document.TimeAndDate.Year.value=1990;
	document.TimeAndDate.Hour.value=0;
	document.TimeAndDate.Minute.value=00;
	document.TimeAndDate.Seconds.value=0;
	*/
}
function d_to_date_and_time(d) {
	var today, t
	var MinMilli = 1000 * 60;
	var HrMilli = MinMilli * 60;
	var DyMilli = HrMilli * 24;
	today = new Date();
	// d+10956= Date() format
	//window.alert('d= '+d );
	d = d + 10956;
	d * DyMilli;
	today.setTime(d * DyMilli);
	//t=((today.getTime()/DyMilli)-10956);
	//window.alert('t= '+t );
	time_offset = today.getTimezoneOffset();
	Hour = today.getUTCHours();
	Minute = today.getUTCMinutes();
	Second = today.getUTCSeconds();
	Month = today.getUTCMonth() + 1;
	Day = today.getUTCDate();
	Year = today.getUTCFullYear();
	return (today)
}
//  get the time for more days, 
function sun_angles(d, SiteLon, SiteLat) {
	var SunSouth, HourAngle, SIDEREALTIME, SatAz, SunSat, Tst, SatelliteAzimuth, pi, NewRA
	var w, a, e, M, L, oblecl, E, x, y, r, v, sunlon, z, xequat, yequat, zequat, RA, Decl, GMST0, UT, SIDTIME, HA
	var SunElevation, xhor, yhor, zhor, SunSatElevationDifference, SatElevation, GeometricElevation
	pi = Math.PI;
	var angles = new Array();
	//*********CALCULATE SUN DATA *********************
	w = 282.9404 + 4.70935E-5 * d; //OK
	a = 1;
	//a=6.6107940559473451507806351067866;
	//a=0;
	//a=149476000; //km average distance
	e = 0.016709 - 1.151E-9 * d;
	M = 356.0470 + 0.9856002585 * d;
	oblecl = 23.4393 - 3.563E-7 * d;
	L = w + Rev(M);
	L = Rev(L);
	E = M + (180 / pi) * e * Math.sin(Radians(M)) * (1 + e * Math.cos(Radians(M)));
	E = Rev(E); // OK
	x = a * Math.cos(Radians(E)) - e;
	y = a * Math.sin(Radians(Rev(E))) * Math.sqrt(1 - e * e);
	r = Math.sqrt(x * x + y * y);
	v = Deg(Math.atan2(y, x));
	sunlon = Rev(v + w); // trolig ok
	x = r * Math.cos(Radians(sunlon));
	y = r * Math.sin(Radians(sunlon));
	z = 0;
	xequat = x;
	yequat = y * Math.cos(Radians(oblecl)) + z * Math.sin(Radians(oblecl));
	zequat = y * Math.sin(Radians(oblecl)) + z * Math.cos(Radians(oblecl));
	RA = Rev(Deg(Math.atan2(yequat, xequat))); // OK
	Decl = Deg(Math.atan2(zequat, Math.sqrt(xequat * xequat + yequat * yequat))); // trolig OK
	GMST0 = (L + 180);
	//*********CALCULATE TIME *********************
	UT = d - Math.floor(d);
	//alert("UT="+UT);
	SIDEREALTIME = GMST0 + UT * 360 + SiteLon; // ok 
	HourAngle = SIDEREALTIME - RA; // trolig ok
	x = Math.cos(HourAngle * pi / 180) * Math.cos(Decl * pi / 180);
	y = Math.sin(HourAngle * pi / 180) * Math.cos(Decl * pi / 180);
	z = Math.sin(Decl * pi / 180);
	xhor = x * Math.sin(SiteLat * pi / 180) - z * Math.cos(SiteLat * pi / 180);
	yhor = y;
	zhor = x * Math.cos(SiteLat * pi / 180) + z * Math.sin(SiteLat * pi / 180);
	// Geocentric coordinates ??
	// 
	var EarthLon, EarthLat
	EarthLat = Deg(Math.atan2(z, Math.sqrt(x * x + y * y))); // trolig OK
	/*
	var mpar=Math.asin(1/r);
	var alt_topoc,alt_geoc,gclat,topRA,gcHA,topDecl,g,rho
	var EarthLon
	EarthLon=Deg(Math.atan2(y,x));
	EarthLat=Deg(Math.atan2(z,Math.sqrt(x*x +y*y )  ));  // trolig OK
	//alert(EarthLon+' '+EarthLat);
	gclat = (SiteLat*(pi/180) - 0.1924*(pi/180)* Math.sin(2*SiteLat*pi/180)  );  // korrekt
	//alert(gclat*180/pi);
	rho   = 0.99833+ 0.00167 * Math.cos(2*SiteLat*pi/180);
	g = Math.atan( Math.tan(gclat) / Math.cos(HourAngle*pi/180) );
		topRA   = Moon_RA*pi/180  - (mpar * rho * Math.cos(gclat) * Math.sin(HourAngle*pi/180) / Math.cos(Moon_Decl*pi/180));
		topDecl = Moon_Decl*pi/180 - (mpar * rho * Math.sin(gclat) * Math.sin(g - Moon_Decl*(pi/180)) / Math.sin(g));
	gcHA = (SIDEREALTIME*(pi/180) - topRA) ;// = -87.6623_deg = 272.3377_deg
	*/
	/*
	SIDEREALTIME-GMST0-UT*360=SiteLon;  // ok 
	180+topRA=SIDEREALTIME;  // nord
	MoonEarthLon=0*180+topRA*180/pi-GMST0-UT*360;
	*/
	EarthLon = Rev(0 * 180 + RA - GMST0 - UT * 360);
	//alert('g '+g*180/pi+' rho '+rho);
	SunElevation = Deg(Math.asin(zhor)); // ok
	GeometricElevation = SunElevation;
	SunElevation = ElevationRefraction(SunElevation); // atmospheric refraction
	SunAzimuth = Deg(Math.atan2(yhor, xhor));
	angles[0] = SunElevation;
	if (SiteLat < 0) angles[1] = SunAzimuth + 180 // added 1 May 2008
	else
		angles[1] = SunAzimuth + 180;
	//alert("Sun Raw Az="+SunAzimuth);
	angles[2] = Decl;
	angles[3] = sunlon;
	angles[4] = RA;
	angles[5] = Rev(GMST0);
	angles[6] = Rev(M);
	angles[7] = Rev(w);
	angles[8] = Rev(e);
	angles[9] = Rev(oblecl);
	angles[10] = GeometricElevation;
	angles[11] = L;
	if (SiteLat < 0) angles[14] = Rev(360 - HourAngle)
	else angles[14] = Rev(HourAngle - 180);
	/*
	angles[15]=Rev( ((gcHA)*180/pi)-180);
	angles[16]=topRA*180/pi;
	angles[17]=topDecl*180/pi;
	angles[18]=gclat*180/pi;
	*/
	angles[19] = Rev(EarthLon);
	angles[20] = EarthLat;
	angles[21] = Rev2(HourAngle);
	return (angles);
}
function moon_angles(d, SiteLon, SiteLat) {
	var SunSouth, HourAngle, SIDEREALTIME, SatAz, SunSat, Tst, SatelliteAzimuth, pi, NewRA
	var w, a, e, M, L, N, oblecl, E, x, y, r, v, sunlon, z, xequat, yequat, zequat, RA, Decl, GMST0, UT, SIDTIME, HA
	var SunElevation, xhor, yhor, zhor, SunSatElevationDifference, SatElevation, GeometricElevation
	pi = Math.PI;
	var angles = new Array();
	var sunangles = new Array();
	var E0, E1, xeclip, yeclip, zeclip, Lm, Ls, Ms, Mm, D, F
	var P_lon1, P_lon2, P_lon3, P_lon4, P_lon5, P_lon6, P_lon7, P_lon8, P_lon9, P_lon10, P_lon11, P_lon12
	var P_lat1, P_lat2, P_lat3, P_lat4, P_lat5, P_lat, P_lon, P_moondistance, Moon_RA, Moon_Decl
	var xh, yh, zh, MoonAzimuth, MoonElevation, Iterations, E_error, Ebeforeit, Eafterit, E_ErrorBefore
	//*********CALCULATE Moon DATA *********************
	N = 125.1228 - 0.0529538083 * d;
	i = 5.1454;
	w = 318.0634 + 0.1643573223 * d; //OK
	a = 60.2666;
	//a=6.6107940559473451507806351067866;
	//a=0;
	//a=149476000; //km average distance
	e = 0.054900;
	M = 115.3654 + 13.0649929509 * d;
	w = Rev(w);
	M = Rev(M);
	N = Rev(N);
	// ok so far
	//alert('N='+N+'\n i='+i+'\n w='+w+'\n a='+a+'\n e='+e+'\n M='+M);
	E = M + (180 / pi) * e * Math.sin(Radians(M)) * (1 + e * Math.cos(Radians(M)));
	E = Rev(E); // OK
	Ebeforeit = E;
	// now iterate until difference between E0 and E1 is less than 0.005_deg
	// use E0, calculate E1
	Iterations = 0;
	E_error = 9;
	while ((E_error > 0.0005) && (Iterations < 20)) // ok - itererer korrekt
	{
		Iterations = Iterations + 1;
		E0 = E;
		E1 = E0 - (E0 - (180 / pi) * e * Math.sin(Radians(E0)) - M) / (1 - e * Math.cos(Radians(E0)));
		//alert('1 E0='+E0+'\nNew E1='+E1+'\nE='+E+'\Diff='+Rev(E0-E1));
		E = Rev(E1);
		//alert(Math.abs(E-E0));
		Eafterit = E;
		if (E < E0) E_error = E0 - E
		else E_error = E - E0;
		if (E < Ebeforeit) E_ErrorBefore = Ebeforeit - E
		else E_ErrorBefore = E - Ebeforeit;
		window.status = "Iterations=" + Iterations + " Moon eccentric anomaly error before iterations=" + formatvalue(E_ErrorBefore, 7) + "_deg after iterations=" + E_error + "_deg";
		if (Iterations > 10) window.status = "Number of Iterations more than 10=" + Iterations + " Ebefore=" + Ebeforeit + " Eafter=" + Eafterit + " E_errorbefore=" + formatvalue(E_ErrorBefore, 7) + " E_errorafter" + E_error;
	}
	//alert(E);
	x = a * (Math.cos(Radians(E)) - e);
	y = a * Math.sin(Radians(Rev(E))) * Math.sqrt(1 - e * e);
	r = Math.sqrt(x * x + y * y);
	v = Deg(Math.atan2(y, x));
	//alert('E='+E);
	// ok så langt
	sunlon = Rev(v + w); // trolig ok
	x = r * Math.cos(Radians(sunlon));
	y = r * Math.sin(Radians(sunlon));
	z = 0;
	xeclip = r * (Math.cos(Radians(N)) * Math.cos(Radians(v + w)) - Math.sin(Radians(N)) * Math.sin(Radians(v + w)) * Math.cos(Radians(i)));
	yeclip = r * (Math.sin(Radians(N)) * Math.cos(Radians(v + w)) + Math.cos(Radians(N)) * Math.sin(Radians(v + w)) * Math.cos(Radians(i)));
	zeclip = r * Math.sin(Radians(v + w)) * Math.sin(Radians(i));
	//alert('xeclip='+xeclip+'\nyeclip='+yeclip+'\nzeclip='+zeclip+'\Long='+Rev(v+w));
	//ok so far
	moon_longitude = Rev(Deg(Math.atan2(yeclip, xeclip))); // OK
	moon_latitude = Deg(Math.atan2(zeclip, Math.sqrt(xeclip * xeclip + yeclip * yeclip))); // trolig OK
	// Now add Perbutations, we actually need Sun mean longitude and Suns mean anomaly
	//alert('moon_longitude='+moon_longitude+'\nmoon_latitude='+moon_latitude+'\nr='+r);
	sunangles = sun_angles(d, SiteLon, SiteLat);
	Ls = sunangles[11]; // Suns mean longitude  er feil
	Ms = sunangles[6]; // Suns mean anomaly
	Mm = Rev(M); // Moons mean anomaly
	Lm = Rev(N + w + M); // moon mean longitude
	D = Rev(Lm - Ls); //Moons mean elongation
	F = Rev(Lm - N); //Moons argument of latitude
	//alert('Ms='+Ms+'\nMm='+Mm+'\nLs='+Ls+'\nLm='+Lm+'\nD='+D+'\nF='+F);
	// ok so far
	// Perbutations Moons Longitude
	P_lon1 = -1.274 * Math.sin(Radians(Mm - 2 * D)); //  (Evection)
	P_lon2 = +0.658 * Math.sin(Radians(2 * D)); //    (Variation)
	P_lon3 = -0.186 * Math.sin(Radians(Ms)); //    (Yearly equation)
	P_lon4 = -0.059 * Math.sin(Radians(2 * Mm - 2 * D));
	P_lon5 = -0.057 * Math.sin(Radians(Mm - 2 * D + Ms));
	P_lon6 = +0.053 * Math.sin(Radians(Mm + 2 * D));
	P_lon7 = +0.046 * Math.sin(Radians(2 * D - Ms));
	P_lon8 = +0.041 * Math.sin(Radians(Mm - Ms));
	P_lon9 = -0.035 * Math.sin(Radians(D)); //      (Parallactic equation)
	P_lon10 = -0.031 * Math.sin(Radians(Mm + Ms));
	P_lon11 = -0.015 * Math.sin(Radians(2 * F - 2 * D));
	P_lon12 = +0.011 * Math.sin(Radians(Mm - 4 * D));
	// Perbutations Moons Latitude
	P_lat1 = -0.173 * Math.sin(Radians(F - 2 * D));
	P_lat2 = -0.055 * Math.sin(Radians(Mm - F - 2 * D));
	P_lat3 = -0.046 * Math.sin(Radians(Mm + F - 2 * D));
	P_lat4 = +0.033 * Math.sin(Radians(F + 2 * D));
	P_lat5 = +0.017 * Math.sin(Radians(2 * Mm + F));
	P_lon = P_lon1 + P_lon2 + P_lon3 + P_lon4 + P_lon5 + P_lon6 + P_lon7 + P_lon8 + P_lon9 + P_lon10 + P_lon11 + P_lon12;
	P_lat = P_lat1 + P_lat2 + P_lat3 + P_lat4 + P_lat5;
	P_moondistance = -0.58 * Math.cos(Radians(Mm - 2 * D)) - 0.46 * Math.cos(Radians(2 * D));
	//alert('P_lon='+P_lon+'\nP_lat='+P_lat+'\nP_moondistance='+P_moondistance);
	moon_longitude = moon_longitude + P_lon;
	moon_latitude = moon_latitude + P_lat;
	r = r + P_moondistance;
	//alert('moon_longitude='+moon_longitude+'\nmoon_latitude='+moon_latitude+'\nmoondistance='+r);
	// OK so far
	// now calculate RA & Decl
	// get the Eliptic coordinates
	xh = r * Math.cos(Radians(moon_longitude)) * Math.cos(Radians(moon_latitude));
	yh = r * Math.sin(Radians(moon_longitude)) * Math.cos(Radians(moon_latitude));
	zh = r * Math.sin(Radians(moon_latitude));
	// rotate to rectangular equatorial coordinates
	xequat = xh;
	yequat = yh * Math.cos(Radians(sunangles[9])) - zh * Math.sin(Radians(sunangles[9]));
	zequat = yh * Math.sin(Radians(sunangles[9])) + zh * Math.cos(Radians(sunangles[9]));
	Moon_RA = Rev(Deg(Math.atan2(yh, xh))); // OK
	Moon_Decl = Deg(Math.atan2(zh, Math.sqrt(xh * xh + yh * yh))); // trolig OK
	Moon_RA = Rev(Deg(Math.atan2(yequat, xequat))); // OK
	Moon_Decl = Deg(Math.atan2(zequat, Math.sqrt(xequat * xequat + yequat * yequat))); // trolig OK
	// above is ecliptic coordinates...
	//alert('moon_RA='+Moon_RA+'\nMoon_Decl='+Moon_Decl+'\nmoondistance='+r+'\nObecl='+sunangles[9]);
	GMST0 = (Ls + 180);
	//*********CALCULATE TIME *********************
	UT = d - Math.floor(d);
	//alert("UT="+UT);
	SIDEREALTIME = GMST0 + UT * 360 + SiteLon; // ok 
	HourAngle = SIDEREALTIME - Moon_RA; // trolig ok
	x = Math.cos(HourAngle * pi / 180) * Math.cos(Moon_Decl * pi / 180);
	y = Math.sin(HourAngle * pi / 180) * Math.cos(Moon_Decl * pi / 180);
	z = Math.sin(Moon_Decl * pi / 180);
	xhor = x * Math.sin(SiteLat * pi / 180) - z * Math.cos(SiteLat * pi / 180);
	//alert('sitelat='+SiteLat+'\nsitelon='+SiteLon);
	yhor = y;
	zhor = x * Math.cos(SiteLat * pi / 180) + z * Math.sin(SiteLat * pi / 180);
	MoonElevation = Deg(Math.asin(zhor)); // ok regner ikke måne elevation helt riktig...
	MoonElevation = MoonElevation - Deg(Math.asin(1 / r * Math.cos(Radians(MoonElevation))));
	//
	GeometricElevation = MoonElevation;
	MoonElevation = ElevationRefraction(MoonElevation); // atmospheric refraction
	MoonAzimuth = Deg(Math.atan2(yhor, xhor));
	angles[0] = MoonElevation;
	if (SiteLat < 0) angles[1] = MoonAzimuth + 180 // added 180 deg 
	else
		angles[1] = MoonAzimuth + 180;
	//alert("Moon Raw Az="+MoonAzimuth);
	//alert('Moon Azimuth='+angles[1]+'\nMoon Elevation='+MoonElevation+' Geometric elevation='+GeometricElevation);
	//moon_longitude=Rev(Deg(Math.atan2(y,xeclip)));   // OK
	//moon_latitude=Deg(Math.atan2(zeclip,Math.sqrt(xeclip*xeclip +yeclip*yeclip )  ));  // trolig OK
	var mpar = Math.asin(1 / r);
	var alt_topoc, alt_geoc, gclat, topRA, gcHA, topDecl, g, rho
	var EarthLon
	EarthLon = Deg(Math.atan2(y, x));
	EarthLat = Deg(Math.atan2(z, Math.sqrt(x * x + y * y))); // trolig OK
	//EarthLon=Deg(Math.atan2(yequat,xequat));
	//EarthLat=Deg(Math.atan2(zequat,Math.sqrt(xequat*xequat +yequat*yequat )  ));  // trolig OK
	//EarthLon=Deg(Math.atan2(yh,xh));
	//EarthLat=Deg(Math.atan2(zh,Math.sqrt(xh*xh +yh*yh )  ));  // trolig OK
	EarthLon = Deg(Math.atan2(yhor, xhor));
	//EarthLat=Deg(Math.atan2(zhor,Math.sqrt(xhor*xhor +yhor*yhor )  ));  // trolig OK
	//alert(EarthLon+' '+EarthLat);
	gclat = (SiteLat * (pi / 180) - 0.1924 * (pi / 180) * Math.sin(2 * SiteLat * pi / 180)); // korrekt
	//alert(gclat*180/pi);
	rho = 0.99833 + 0.00167 * Math.cos(2 * SiteLat * pi / 180);
	g = Math.atan(Math.tan(gclat) / Math.cos(HourAngle * pi / 180));
	topRA = Moon_RA * pi / 180 - (mpar * rho * Math.cos(gclat) * Math.sin(HourAngle * pi / 180) / Math.cos(Moon_Decl * pi / 180));
	topDecl = Moon_Decl * pi / 180 - (mpar * rho * Math.sin(gclat) * Math.sin(g - Moon_Decl * (pi / 180)) / Math.sin(g));
	gcHA = (SIDEREALTIME * (pi / 180) - topRA); // = -87.6623_deg = 272.3377_deg
	/*
	SIDEREALTIME-GMST0-UT*360=SiteLon;  // ok 
	180+topRA=SIDEREALTIME;  // nord
	MoonEarthLon=0*180+topRA*180/pi-GMST0-UT*360;
	*/
	EarthLon = Rev(0 * 180 + topRA * 180 / pi - GMST0 - UT * 360);
	//alert('g '+g*180/pi+' rho '+rho);
	/*
	 */
	/*
	Let's start by computing the Moon's parallax, i.e. the apparent size of the (equatorial) radius of the Earth, as seen from the Moon:
		mpar = asin( 1/r )
	where r is the Moon's distance in Earth radii. It's simplest to apply the correction in horizontal coordinates (azimuth and altitude): within our accuracy aim of 1-2 arc minutes, no correction need to be applied to the azimuth. One need only apply a correction to the altitude above the horizon:
		alt_topoc = alt_geoc - mpar * cos(alt_geoc)
	Sometimes one needs to correct for topocentric position directly in equatorial coordinates though, e.g. if one wants to draw on a star map how the Moon passes in front of the Pleiades, as seen from some specific location. Then we need to know the Moon's geocentric Right Ascension and Declination (RA, Decl), the Local Sidereal Time (LST), and our latitude (lat).
	Our astronomical latitude (lat) must first be converted to a geocentric latitude (gclat) and distance from the center of the Earth (rho) in Earth equatorial radii. If we only want an approximate topocentric position, it's simplest to pretend that the Earth is a perfect sphere, and simply set:
		gclat = lat,  rho = 1.0
	However, if we do wish to account for the flattening of the Earth, we instead compute:
		gclat = lat - 0.1924_deg * sin(2*lat)
		rho   = 0.99833 + 0.00167 * cos(2*lat)
	Next we compute the Moon's geocentric Hour Angle (HA):
		HA = LST - RA
	We also need an auxiliary angle, g:
		g = atan( tan(gclat) / cos(HA) )
	Now we're ready to convert the geocentric Right Ascention and Declination (RA, Decl) to their topocentric values (topRA, topDecl):
		topRA   = RA  - mpar * rho * cos(gclat) * sin(HA) / cos(Decl)
		topDecl = Decl - mpar * rho * sin(gclat) * sin(g - Decl) / sin(g)
	Let's do this correction for our test date and for the geographical position 15 deg E longitude (= +15_deg) and 60 deg N latitude (= +60_deg). Earlier we computed the Local Sidereal Time as LST = SIDTIME = 14.78925 hours. Multiply by 15 to get degrees: LST = 221.8388_deg
	The Moon's Hour Angle becomes:
		HA = LST - RA = -87.6623_deg = 272.3377_deg
	Our latitude +60_deg yields the following geocentric latitude and distance from the Earth's center:
		gclat = 59.83_deg  rho   = 0.9975
	We've already computed the Moon's distance as 60.6779 Earth radii, which means the Moon's parallax is:
		mpar = 0.9443_deg
	The auxiliary angle g becomes:
		g = 88.642
	And finally the Moon's topocentric position becomes:
		topRA   = 309.5011_deg - (-0.5006_deg) = 310.0017_deg
		topDecl = -19.1032_deg - (+0.7758_deg) = -19.8790_deg
	*/
	angles[2] = Moon_Decl;
	angles[3] = moon_longitude;
	angles[4] = Moon_RA;
	angles[5] = Rev(GMST0);
	angles[6] = Rev(M);
	angles[7] = Rev(w);
	angles[8] = Rev(e);
	angles[9] = Rev(oblecl);
	angles[10] = GeometricElevation;
	angles[11] = moon_latitude;
	angles[12] = MoonElevation;
	angles[13] = r;
	if (SiteLat < 0) angles[14] = Rev(360 - HourAngle)
	else angles[14] = Rev(HourAngle - 180);
	if (SiteLat < 0) angles[15] = Rev(360 - ((gcHA) * 180 / pi))
	else angles[15] = Rev(((gcHA) * 180 / pi) - 180);
	angles[16] = topRA * 180 / pi;
	angles[17] = topDecl * 180 / pi;
	angles[18] = gclat * 180 / pi;
	angles[19] = EarthLon;
	angles[20] = EarthLat;
	angles[21] = Rev2(HourAngle);
	angles[22] = Rev2(((gcHA) * 180 / pi));
	return (angles);
}
function ElevationRefraction(El_geometric) {
	var El_observed
	var x, a0, a1, a2, a3, a4
	a0 = 0.58804392;
	a1 = -0.17941557
	a2 = 0.29906946E-1;
	a3 = -0.25187400E-2;
	a4 = 0.82622101E-4;
	El_observed = El_geometric;
	x = Math.abs(El_geometric + 0.589);
	refraction = Math.abs(a0 + a1 * x + a2 * x * x + a3 * x * x * x + a4 * x * x * x * x);
	if (El_geometric > 10.2) {
		El_observed = El_geometric + 0.01617 * (Math.cos(Radians(Math.abs(El_geometric))) / Math.sin(Radians(Math.abs(El_geometric))));
	} else {
		El_observed = El_geometric + refraction;
	}
	return (El_observed);
}
//********WORKS OK
function SetCookie() {
	var Lat, Lon, LatDir, LonDir, CookieValue
	var SitePosCurrentIndex
	var MyCookieVal
	var ValArray = new Array();
	var SubArray = new Array();
	SitePosCurrentIndex = 1073; // Used only if there are not any cookie stored
	//SatNameCurrentIndex =40 ;
	MyCookieVal = document.cookie;
	//alert(MyCookieVal);
	if (MyCookieVal !== "") // If cookie has value then set users defaults
	{
		ValArray = MyCookieVal.split(":"); //' Reads 6 cookie values in to the array    
		/*
		Lat=ValArray[0];
		LatDir=ValArray[1];
		Lon=ValArray[2];
		LonDir=ValArray[3];
		SitePosCurrentIndex=ValArray[4];
		SatNameCurrentIndex=ValArray[5];
		SetLocation= ValArray[6];
		Calibrate_pulsevalue=ValArray[7];
		Calibrate_pulse_per_ha_degree=ValArray[8];
		calibrate_inc_direction=ValArray[9];
		HA_for_calibrated_position=ValArray[10];
		*/
	}
	SitePosCurrentIndex = document.Site.Position.selectedIndex;
	Lat = 1 * document.Latitude.Degrees.value;
	LatDir = document.Latitude.Direction.value;
	Lon = 1 * document.Longitude.Degrees.value;
	LonDir = document.Longitude.Direction.value;
	SubArray = document.Site.Position.value.split(",");
	//alert(SubArray[2]);
	ValArray[15] = SubArray[2];
	var MyVal
	MyVal = document.Site.Position.value;
	var MyValArray = new Array();
	var MySubArray = new Array();
	if (MyVal !== null) {
		// Check  position from list
		MyValArray = MyVal.split(",");
		MySubArray = MyValArray[0].split(":"); // The first subarray containing Lat:LatDir
		if ((Lat != MySubArray[0]) || (LatDir != MySubArray[1])) ValArray[15] = "User defined location";
		MySubArray = MyValArray[1].split(":"); // The second subarray containing Lon:LonDir
		if ((Lon != MySubArray[0]) || (LonDir != MySubArray[1])) ValArray[15] = "User defined location";
	}
	CookieValue = Lat + ":" + LatDir + ":" + Lon + ":" + LonDir + ":" + SitePosCurrentIndex + ":" + SatNameCurrentIndex + ":" + SetLocation + ":" + Calibrate_pulsevalue + ":" + Calibrate_pulse_per_ha_degree + ":" + calibrate_inc_direction + ":" + HA_for_calibrated_position + ":" + ValArray[11] + ":" + ValArray[12] + ":" + ValArray[13] + ":" + ValArray[14] + ":" + ValArray[15] + ":" + ValArray[16] + ":" + ValArray[17] + ":" + ValArray[18] + ":" + ValArray[19] + ":" + ValArray[20] + ";expires=Tue, 10 Jul 2040 23:59:59 UTC;";
	deleteAllCookies();
	document.cookie = CookieValue; // Store cookie
}
function deleteAllCookies() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}
function ReadCookie() {
	var Lat, Lon, LatDir, LonDir, CookieValue, MyCookieVal
	var ValArray = new Array();
	var SubArray = new Array();
	SitePosCurrentIndex = 1073; // Used only if there are not any cookie stored
	//SatNameCurrentIndex =40 ;
	MyCookieVal = document.cookie;
	//alert(MyCookieVal);
	if (MyCookieVal !== "") // If cookie has value then set users defaults
	{
		ValArray = MyCookieVal.split(":"); //' Reads 6 cookie values in to the array    
		Lat = ValArray[0];
		LatDir = ValArray[1];
		Lon = ValArray[2];
		LonDir = ValArray[3];
		SitePosCurrentIndex = ValArray[4];
		SatNameCurrentIndex = ValArray[5];
		SetLocation = ValArray[6];
		Calibrate_pulsevalue = ValArray[7];
		Calibrate_pulse_per_ha_degree = ValArray[8];
		calibrate_inc_direction = ValArray[9];
		HA_for_calibrated_position = ValArray[10];
	}
	document.Site.Position.selectedIndex = SitePosCurrentIndex;
	document.Latitude.Degrees.value = Lat; // Set user defaults if cookie already stored on the system
	document.Latitude.Direction.value = LatDir; //   ' Set user defaults if cookie already stored on the system
	document.Longitude.Degrees.value = Lon; //' Set user defaults if cookie already stored on the system
	document.Longitude.Direction.value = LonDir; //    ' Set user defaults if cookie already stored on the system
} // end function
function ReadPosition() //   Store the selected position in the cookie
{
	var Lat, Lon, LatDir, LonDir, CookieValue, MyVal
	var ValArray = new Array();
	var SubArray = new Array();
	MyVal = document.Site.Position.value;
	if (MyVal == null) alert("Cookie damaged - plese run the cookie repair script !");
	if (MyVal !== null) {
		// Check  position
		ValArray = MyVal.split(",");
		SubArray = ValArray[0].split(":"); // The first subarray containing Lat:LatDir
		Lat = SubArray[0];
		LatDir = SubArray[1];
		SubArray = ValArray[1].split(":"); // The second subarray containing Lon:LonDir
		Lon = SubArray[0];
		LonDir = SubArray[1];
		document.Latitude.Degrees.value = Lat; // Set user defaults if cookie already stored on the system
		document.Latitude.Direction.value = LatDir; // Set user defaults if cookie already stored on the system
		document.Longitude.Degrees.value = Lon; // Set user defaults if cookie already stored on the system
		document.Longitude.Direction.value = LonDir; // Set user defaults if cookie already stored on the system
	}
} // End function
function Rev(number) {
	var x
	x = number - Math.floor(number / 360.0) * 360;
	return (x)
}
function Rev2(number) {
	var x
	x = number - Math.floor(number / 360.0) * 360;
	if (x > 180) x = x - 360;
	return (x)
}
function Radians(number) {
	var rad
	rad = number * Math.PI / 180;
	return (rad)
}
function Deg(number) {
	var rad
	rad = number * 180 / Math.PI;
	return (rad)
}
function daynumber(Day, Month, Year, Hour, Minute, Second) {
	//window.alert(Day+" "+Month+" "+Year+" "+Hour+" "+Minute+" "+Second);
	d = 367 * Year - Div((7 * (Year + (Div((Month + 9), 12)))), 4) + Div((275 * Month), 9) + Day - 730530
	// d is correct
	//window.alert(d);
	d = d + Hour / 24 + Minute / (60 * 24) + Second / (24 * 60 * 60) // OK
	return (d)
}
function Div(a, b) {
	return ((a - a % b) / b) //OK
}
function formatnumber(num, places) {
	var strOP, i, decimals, newdecimals, integer, newstring, numcopy
	var ss = new Array()
	numcopy = num;
	var a = Math.pow(10, Math.abs(places) == places ? places : 2);
	strOP = String(Math.round(num * a) / a).replace(/^(\d)/, " $1");
	if (num < 0) strOP = " " + strOP; // put " " on negative numbers
	//num=parseFloat(strOP);  
	ss = strOP.split("."); //  split string by .   what about zero..?
	if ((num !== 0) && (ss.length > 1)) {
		decimals = ss[1];
		integer = ss[0];
		if (decimals.length < places) //  check str length after . and add zeroes if decimals shorter than places
		{
			var addzeroes = "0";
			for (i = 0; i < (places - decimals.length - 1); i++) {
				addzeroes += "0";
			}
			//01
			strOP = integer + "." + decimals + addzeroes;
		}
	} else // num= integer
	{
		decimals = "0";
		for (i = 0; i < places - 1; i++) {
			decimals += "0";
		}
		strOP = numcopy + "." + decimals;
	}
	if (numcopy >= 0) strOP = " " + strOP;
	return (strOP)
}
function formatvalue(input, rsize) // Desimal avrunding
{
	var invalid = "**************************";
	var nines = "999999999999999999999999";
	var strin = "" + input;
	var fltin = parseFloat(strin);
	if (strin.length <= rsize) return strin;
	if (strin.indexOf("e") != -1 ||
		fltin > parseFloat(nines.substring(0, rsize) + ".4"))
		return invalid.substring(0, rsize);
	var rounded = "" + (fltin + (fltin - parseFloat(strin.substring(0, rsize))));
	return rounded.substring(0, rsize);
}