function direct(CONFIG) {
    console.log(CONFIG?.a);
}
function nested(CONFIG) {
    console.log(CONFIG?.a?.b);
}
function shortCircuit(CONFIG) {
    console.log(CONFIG?.a);
}
const CONFIG = {
    a: {
        b: 4
    }
};
direct({
    a: 2
});
nested({
    a: {
        b: 3
    }
});
shortCircuit(null);
console.log(1);
