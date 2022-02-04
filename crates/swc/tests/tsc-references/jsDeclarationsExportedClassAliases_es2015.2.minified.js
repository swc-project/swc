module.exports = {
    FancyError: class extends Error {
        constructor(status){
            super(`error with status ${status}`);
        }
    }
};
const errors = require("./errors");
module.exports = {
    errors
};
