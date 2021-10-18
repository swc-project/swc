
const { async } = require("regenerator-runtime");



async function f() {
    try {
        throw new 'Real error'
    } catch (e) {
        try {
            throw 'Test'
        } catch (e) {
            console.log(e);
        }
    }
}



f()