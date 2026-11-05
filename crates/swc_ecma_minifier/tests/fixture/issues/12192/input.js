try {
    ({} = null);
    console.log("wrong: null");
} catch (error) {
    console.log(error.name);
}

try {
    ({} = void 0);
    console.log("wrong: undefined");
} catch (error) {
    console.log(error.name);
}

let property;
try {
    ({ property } = null);
    console.log("wrong: nonempty pattern");
} catch (error) {
    console.log(error.name);
}

function requireObject(value) {
    try {
        ({} = value);
        console.log("wrong: unknown value");
    } catch (error) {
        console.log(error.name);
    }
}

requireObject(null);

function sideEffect() {
    console.log("side effect");
}

({} = (sideEffect(), {}));
({} = []);
({} = 0);
({} = false);
({} = "");
