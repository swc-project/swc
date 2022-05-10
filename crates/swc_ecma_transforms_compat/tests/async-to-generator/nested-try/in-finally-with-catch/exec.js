const { async } = require("regenerator-runtime");

async function f() {
    try {
        throw new "Real error"();
    } catch (e1) {
        console.log(e1.message);
        try {
            throw "Test";
        } catch (e2) {
            console.log(e2);
        }
    }
}

f();
