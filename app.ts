import Express from "./services/server/Express.ts";

// const lon: number = 24.10641937837778;
// const lat: number = 56.94727913647638;

// blah blah blah its lowercase idgaf
class app {

    public express = new Express(8080);

    constructor() {
        this.express.setRoutes();
        this.express.startExpress();
    }

}

new app();