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
function foo1(alert1) {
    window.alert();
}
function foo2() {
    alert();
}
function foo3() {
    var _$alert = function alert1() {};
}
alert();
// currently unsupported
// this.alert(foo)
// this['alert'](foo)
function foo4() {
    var _$window = bar;
    _$window.alert();
}
window.alert();
function foo5() {
    _$alert();
    var _$alert = function alert1() {};
}
alert(function() {
    return alert("foo");
});
(function() {
    var obj = {
        alert: alert
    };
})();
(function() {
    alert = function alert1() {};
})();
(function() {
    console.log(alert);
})();
fu(function() {
    return alert("");
});
