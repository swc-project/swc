let value;
function* values() {
    try {
        console.log("next"), yield 1;
    } finally{
        console.log("return");
    }
}
[value] = values(), console.log(value);
