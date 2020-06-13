const path = require('path');

module.exports = {
    entry: {
        a: path.join(__dirname, 'entry1.js'),
        b: path.join(__dirname, 'entry2.js'),
    },
}