const MenuDocsClient = require('./Structures/MenuDocsClient');
const config = require("./Data/Config.json");
const package = require("../package.json");
const fs = require("fs");

console.log("Starting...");

// increase version at each start
let Version = package.version.split(".");
let Vcenti = parseInt(Version[2]);
let Vdeci = parseInt(Version[1]);
let Vmain = parseInt(Version[0]);

Vcenti++;
if (Vcenti === 10000) {
    Vcenti = 0;
    Vdeci++;
}
if (Vdeci === 100) {
    Vdeci = 0;
    Vmain++;
}

package.version = `${Vmain}.${Vdeci}.${Vcenti}`;
fs.writeFile("./package.json", JSON.stringify(package, package, 4), function (err) {
    if (err) console.log(err);
});

const client = new MenuDocsClient(config);
client.start();
