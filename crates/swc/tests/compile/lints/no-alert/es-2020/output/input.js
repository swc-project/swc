// Test cases taken form https://github.com/eslint/eslint/blob/5769cc23eca7197bb5993a0201cc269a056d4dfd/tests/lib/rules/no-alert.js
globalThis.alert();
function foo() {
    var globalThis1 = bar;
    globalThis1.alert();
}
globalThis.alert();
window?.alert(foo);
(window?.alert)(foo);
