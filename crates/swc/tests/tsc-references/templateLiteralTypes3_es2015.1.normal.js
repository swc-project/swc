// @strict: true
// @declaration: true
// Inference from template literal type to template literal type
function f1(s, n, b, t) {
    let x1 = foo1('hello'); // Error
    let x2 = foo1('*hello*');
    let x3 = foo1('**hello**');
    let x4 = foo1(`*${s}*`);
    let x5 = foo1(`*${n}*`);
    let x6 = foo1(`*${b}*`);
    let x7 = foo1(`*${t}*`);
    let x8 = foo1(`**${s}**`);
}
function f2() {
    let x;
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
}
function f3(s, n, b, t) {
    let x;
    x = 'hello'; // Error
    x = '*hello*';
    x = '**hello**';
    x = `*${s}*`;
    x = `*${n}*`;
    x = `*${b}*`;
    x = `*${t}*`;
    x = `**${s}**`;
}
function f4(s, n, b, t) {
    let x;
    x = '123'; // Error
    x = '*123*';
    x = '**123**'; // Error
    x = `*${s}*`; // Error
    x = `*${n}*`;
    x = `*${b}*`; // Error
    x = `*${t}*`;
}
const value1 = "abc";
const templated1 = `${value1} abc`;
// Type '`${string} abc`' is not assignable to type '`${string} ${string}`'.
const value2 = "abc";
const templated2 = `${value2} abc`;
chain("a");
// Repro from #46125
function ff1(x, y, z) {
    if (x === y) {
        x; // `foo-${string}`
    }
    if (x === z) {}
}
function ff2(x, y, z) {
    if (x === y) {
        x; // `foo-${T}`
    }
    if (x === z) {}
}
function ff3(x, y) {
    if (x === y) {
        x; // `foo-${string}` | 'bar'
    }
}
function ff4(x, y) {
    if (x === 'foo-test') {
        x; // 'foo-test'
    }
    if (y === 'foo-test') {
        y; // 'foo-test'
    }
}
function reducer(action) {
    if (action.type === 'FOO_SUCCESS') {
        action.type;
        action.response;
    }
}
noSpread([
    `1.${'2'}.3`,
    `1.${'2'}.4`
]);
noSpread([
    `1.${'2'}.3`,
    `1.${'2'}.4`
]);
spread(`1.${'2'}.3`, `1.${'2'}.4`);
spread(`1.${'2'}.3`, `1.${'2'}.4`);
function ft1(t, u, u1, u2) {
    spread(`1.${t}.3`, `1.${t}.4`);
    spread(`1.${u}.3`, `1.${u}.4`);
    spread(u1, u2);
}
