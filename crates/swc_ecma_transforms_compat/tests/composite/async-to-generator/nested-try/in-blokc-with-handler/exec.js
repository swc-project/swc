const { async } = require("regenerator-runtime");

async function f() {
    try {
        try {
            throw "Test";
        } catch (e) {
            console.log(e);

            throw "catch me if you can";
        } finally {
        }
    } catch (e) {
        console.log(e);
    }
}

f();
