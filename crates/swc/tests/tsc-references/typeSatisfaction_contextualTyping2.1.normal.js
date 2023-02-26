//// [typeSatisfaction_contextualTyping2.ts]
var obj = {
    f: function f(s) {},
    g: function g(s) {}
};
// This needs to not crash (outer node is not expression)
({
    f: function f(x) {}
});
