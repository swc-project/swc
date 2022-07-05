let a = class /* a */ {};
let [b] = [class /* no named */ {}];
let [c = class /* c */ {}] = [];
let [d = class /* d */ {}] = [class /* no named */ {}];

let { e } = { e: class /* e */ {} };
let { f = class /* f */ {} } = {};
let { g = class /* g */ {} } = { g: class /* g */ {} };
let { _: h = class /* h */ {} } = {};

a = class /* a */ {};
b ||= class /* b */ {};
c ??= class /* c */ {};

function foo(bar = class /* bar */ {}) {}

d = {
    i: class /* i */ {},
};
