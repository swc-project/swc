function f(a = x?.y) {}

function g({ a, b = a?.c }) {}

function h(a, { b = a.b?.c?.d.e }) {}

function i(a, { b = (a.b?.c?.d).e }) {}

function j(a, { b = a?.b?.c().d.e }) {}

const k = function (a, b = a?.b) {};

const l = (a, b = a?.b) => {};

const m = {
    m(a, b = a?.b) {},
};

const n = class {
    n(a, b = a?.b) {}
};

const o = {
    set o(a = b?.c) {},
};
