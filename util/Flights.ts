import MathUtil from './MathUtil.ts';
import axios from 'axios';
import 'dotenv/config';

class Flights {
    
    private lon;
    private lat;
    private mathUtil;

    constructor(lon: number, lat: number) {
        this.lon = lon;
        this.lat = lat;
        this.mathUtil = new MathUtil();
        
    }

    async getToken() {

        const payload = `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;

        try {
            const token = await axios.post("https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token", payload);
            return token.data['access_token'];
        } catch (err) {
            console.log(err);
        }

    }

    async getFlights() {

        const searchSize = 150;

        const lonDelta: number = searchSize / (111 * Math.cos(this.lat * Math.PI / 180));
        const latDelta: number = searchSize / 111;

        const url = `https://opensky-network.org/api/states/all?lamin=${this.lat-this.mathUtil.latDelta}&lomin=${lon-lonDelta}&lamax=${lat+latDelta}&lomax=${lon+lonDelta}`;

        try {

            const response = axios.get(url, {
                headers: {
                    // Authorization: 
                }
            })

        } catch(err) {
            console.log(err);
        }

    }

}

export default Flights;