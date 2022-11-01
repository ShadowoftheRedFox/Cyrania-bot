//. Run script with "node test/mini.test.js" in shell

/*
? What is the point of this script?

It is to minify all the data in the raw arrets-lignes.json
In this script, we just want the stop name, the operator of the line and the city name and what line deserves the stop.
We don't really care about the geographical position and all of the other stuff.

So the script go through all items, and build an item for each stop.

& Precision:
The script first create a map object depending of the station name.
If the key exist, add the data if they are different (for example, line or operator)
Then go to the next one until the end.
*/

/**
 * @type {TrainStop[]}
 */
const StopsArray = require("../src/Commands/RATP/arrets-lignes-raw.json");
/**
 * @type {TrainStopMinifyV1[]}
 */
const StopsArrayMinV1 = require("../src/Commands/RATP/arrets-lignes-min.v1.json");
/**
 * @type {TrainStopMinifyV2}
 */
const StopsArrayMinV2 = require("../src/Commands/RATP/arrets-lignes-min.v2.json");
const fs = require("fs");

var timestamp = Date.now();
var result = {};
console.log("Minifying stops...");


//. BEGIN A # transform data to station name linked with data
/*
StopsArray.forEach(stops => {
    const StopName = stops.fields.stop_name;
    if (!result[StopName]) {
        // key not found, creating an entry
        result[StopName] = {
            stop_name: StopName,
            operatorname: [stops.fields.operatorname],
            nom_commune: [stops.fields.nom_commune],
            route_long_name: [stops.fields.route_long_name]
        };
    } else {
        // key found, adding data if they are different
        if (!result[StopName].operatorname.includes(stops.fields.operatorname)) result[StopName].operatorname.push(stops.fields.operatorname);
        if (!result[StopName].nom_commune.includes(stops.fields.nom_commune)) result[StopName].nom_commune.push(stops.fields.nom_commune);
        if (!result[StopName].route_long_name.includes(stops.fields.route_long_name)) result[StopName].route_long_name.push(stops.fields.route_long_name);
    }
});

// should be full with a lot of data (if you work with the given data from the RATP)
console.log(Object.keys(result).length); // length to shorten the display time

fs.writeFileSync("./src/Commands/RATP/arrets-lignes-min.v2.json", JSON.stringify(result));
fs.writeFileSync("./test/preview.json", JSON.stringify(result));
console.log(`Finished A. Time taken: \`${(Date.now() - timestamp) / 1000}s\``);
*/
//. END A

//& BEGIN B # Transform data to lines linked to data
StopsArray.forEach(stops => {
    const LineName = stops.fields.route_long_name;
    if (!result[LineName]) {
        // key not found, creating an entry
        result[LineName] = {
            stop_name: [stops.fields.stop_name],
            operatorname: [stops.fields.operatorname],
            nom_commune: [stops.fields.nom_commune],
            route_long_name: LineName
        };
    } else {
        // key found, adding data if they are different
        if (!result[LineName].operatorname.includes(stops.fields.operatorname)) result[LineName].operatorname.push(stops.fields.operatorname);
        if (!result[LineName].nom_commune.includes(stops.fields.nom_commune)) result[LineName].nom_commune.push(stops.fields.nom_commune);
        if (!result[LineName].stop_name.includes(stops.fields.stop_name)) result[LineName].stop_name.push(stops.fields.stop_name);
    }
});

// should be full with a lot of data (if you work with the given data from the RATP)
console.log(Object.keys(result).length); // length to shorten the display time

fs.writeFileSync("./src/Commands/RATP/lignes-min.v1.json", JSON.stringify(result));
fs.writeFileSync("./test/preview.json", JSON.stringify(result));
console.log(`Finished A. Time taken: \`${(Date.now() - timestamp) / 1000}s\``);
//& END B




// old script for v1
/*StopsArray.forEach((stops, id) => {
    if (!stops.fields) return console.log(`Fields not found at ${stops.recordid} (Array index: ${id})`);
    const item = {
        stop_name: StopName,
        operatorname: stops.fields.operatorname,
        nom_commune: stops.fields.nom_commune,
        route_long_name: stops.fields.route_long_name
    };
    StopsArrayMin.push(item);
});

console.log(StopsArrayMin);
fs.writeFile("./src/Commands/RATP/arrets-lignes-min.json", JSON.stringify(StopsArrayMin), function (err) {
    if (err) console.log(err);
    console.log(`Finished. Time taken: \`${(Date.now() - timestamp) / 1000}s\``);
});
*/