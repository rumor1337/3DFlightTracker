import MathUtil from './MathUtil.ts';
import axios from 'axios';
import 'dotenv/config';

class Flights {
    
    private mathUtil;

    constructor() {
        this.mathUtil = new MathUtil();
        
    }

    async getToken() {


        // todo: rewrite properly later
        const payload = `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;

        try {
            const token = await axios.post("https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
                payload,
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            return token.data['access_token'];
        } catch (err) {
            console.log(err);
        }

    }

    async getFlights(lon: number, lat: number) {

        // in km
        const searchSize = 150;

        const lonDelta: number = searchSize / (111 * Math.cos(lat * Math.PI / 180));
        const latDelta: number = searchSize / 111;

        const url = `https://opensky-network.org/api/states/all?lamin=${lat-latDelta}&lomin=${lon-lonDelta}&lamax=${lat+latDelta}&lomax=${lon+lonDelta}`;

        try {

            const response = await axios.get(url, {
                headers: {
                    Authorization: await this.getToken()
                }
            })

            return response.data;
        } catch(err) {
            console.log(err);
        }

    }


    // distance from riga;;
    async returnFlights(lon: number, lat: number) {

        const data = await this.getFlights(lon, lat);

        return (data.states || []).map((state: any[]) => {

            const [_icao24, callsign, _country, _time, _last, longitude, latitude, baroAltitude] = state;

            return {

                callsign: callsign.trim() || "N/A",
                lat: latitude,
                lon: longitude,
                altitude: baroAltitude,
                distanceKm: Number(this.mathUtil.haversine(lat, lon, latitude, longitude).toFixed(2))

            }
        });

    }

}

export default Flights;