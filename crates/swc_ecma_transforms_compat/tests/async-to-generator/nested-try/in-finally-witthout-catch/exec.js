const { async } = require("regenerator-runtime");

async function f() {
    try {
    } finally {
        try {
            throw "Test";
        } catch (e) {
            console.log(e);
        }
    }
}

f();
