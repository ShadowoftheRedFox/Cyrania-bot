const Event = require('../../Structures/Event');
module.exports = class extends Event {
    async run(error) {
        return console.log(error.stack);
    }
};