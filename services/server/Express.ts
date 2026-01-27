import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Logger from '../../util/Logger.ts';
import Flights from '../../util/Flights.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Express {

    private app = express();
    private port : Number = 8080;
    private logger;
    private flightManager;

    constructor(port: number) {
        this.port = port;
        this.logger = new Logger();
        this.flightManager = new Flights();
    }

    public startExpress() {
        try {
            this.app.use(express.static(join(__dirname, '../../public')));
            
            this.app.listen(this.port, () => {
                this.logger.info(`Listening on port ${this.port}`);
            });
        } catch(error: any) {
            this.logger.error(`Caught an exception at startExpress in express: ${error.message}`);
        }
    }

    public setRoutes() {
        this.app.get('/api/v1/flights', async (req, res) => {
            try {

                const longitude = Number (req.query.longitude);
                const latitude = Number (req.query.latitude);

                res.send(await this.flightManager.returnFlights(longitude, latitude));
            } catch(error: any) {
                this.logger.error(`Caught an exception at setRoutes in express: ${error.message}`);
                return res.send("An error has occured, if this does not resolve itself in a short while, please make an issue on the Github page.");
            }

        });

    }
}

export default Express;