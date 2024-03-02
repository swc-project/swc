//// [typeSatisfaction_contextualTyping3.ts]
var fn = function() {
    return arguments.length > 0 && void 0 !== arguments[0] && arguments[0], null;
};
fn(), fn(32);
