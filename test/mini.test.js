//. Run script with "node test/mini.test.js" in shell

const StopsArray = require("../src/Commands/RATP/arrets-lignes.json");
const StopsArrayMin = require("../src/Commands/RATP/arrets-lignes-min.json");
const fs = require("fs");

const t = Date.now();
console.log("Minifying stops...");
StopsArray.forEach((stops, id) => {
    if (!stops.fields) return console.log(`Fields not found at ${stops.recordid} (Array index: ${id})`);
    const item = {
        stop_name: stops.fields.stop_name,
        operatorname: stops.fields.operatorname,
        nom_commune: stops.fields.nom_commune,
    };
    StopsArrayMin.push(item);
});
console.log(StopsArrayMin);
fs.writeFile("./src/Commands/RATP/arrets-lignes-min.json", JSON.stringify(StopsArrayMin), function (err) {
    if (err) console.log(err);
    console.log(`Finished. Time taken: \`${(Date.now() - t) / 1000}s\``);
});