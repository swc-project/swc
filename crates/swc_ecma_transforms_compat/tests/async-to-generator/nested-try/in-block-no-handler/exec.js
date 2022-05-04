const { async } = require("regenerator-runtime");

async function f() {
    try {
        try {
            throw "Test";
        } finally {
        }
    } catch (e) {
        console.log(e);
    }
}

f();
