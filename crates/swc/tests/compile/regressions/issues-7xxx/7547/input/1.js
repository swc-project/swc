// code below dont work
const a = {};

new Promise(r => {
    r(a?.b);
}).then(a => {
    return a?.b;
});

const anony = () => {
    return a?.b;
}

// code below works

const b = a?.b;

function fn() {
    return a?.b;
}

setTimeout(() => a?.b, 0);

const anony2 = function () { return a?.b };

(function () { return a?.b })();