
const { async } = require("regenerator-runtime");



async function f() {
    try {
        throw new 'Real error'
    } catch (e) {
        console.log(e.message);
        try {
            throw 'Test'
        } catch (e) {
            console.log(e);
        }
    }
}



f()