import 'dotenv/config';

async function getFlights(lon: number, lat: number) {

    // 150 -> km
    // probably should change that to a variable
    const lonDelta: number = 150 / (111 * Math.cos(lat * Math.PI / 180));
    const latDelta: number = 150 / 111;

    const url = `https://opensky-network.org/api/states/all?lamin=${lat-latDelta}&lomin=${lon-lonDelta}&lamax=${lat+latDelta}&lomax=${lon+lonDelta}`;

    const response = await fetch(url);
    const data = await response.json();

    return (data.states || []).map((state: any[]) => {
        const [_icao24, callsign, _country, _time, _last, longitude, latitude, baroAltitude] = state;
        
        return {
            callsign: callsign?.trim() || "N/A",
            lat: latitude,
            lon: longitude,
            altitude: baroAltitude,
            distanceKm: Number(haversine(lat, lon, latitude, longitude).toFixed(2))
        };
    });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) 
    * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180))
    * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2)
    * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // 6371 -> earth radius
    return 6371 * c;
}

console.log(await getFlights(24.105719036474586, 56.97013623269729));

