export const getCoords = new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition(position => {
		const { latitude, longitude } = position.coords;
		resolve({latitude, longitude});
	}, error => {
		console.log(error);
		reject(error.message);
	});
});

export function getDistance(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1);
	var a =
	  Math.sin(dLat/2) * Math.sin(dLat/2) +
	  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
	  Math.sin(dLon/2) * Math.sin(dLon/2)
	  ;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
