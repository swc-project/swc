// Test cases taken form https://github.com/eslint/eslint/blob/5769cc23eca7197bb5993a0201cc269a056d4dfd/tests/lib/rules/no-alert.js

alert();
window.alert();
window["alert"]();
confirm();
window.confirm();
window["confirm"]();
prompt();
window.prompt();
window["prompt"]();
function foo1(alert) {
    window.alert();
}
function foo2() {
    alert();
}
function foo3() {
    var alert = function () {};
}
alert();

// currently unsupported
// this.alert(foo)
// this['alert'](foo)

function foo4() {
    var window = bar;
    window.alert();
}
window.alert();

function foo5() {
    alert();
    const alert = () => {};
}

alert(() => alert("foo"));

(() => {
    const obj = {
        alert,
    };
})();

(() => {
    alert = () => {};
})();

(() => {
    console.log(alert);
})();

fu(() => alert(""));
