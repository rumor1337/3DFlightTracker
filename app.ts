import Flights from './util/Flights.ts';

const flights = new Flights(24.105719036474586, 56.97013623269729);

console.log(await flights.getToken());

