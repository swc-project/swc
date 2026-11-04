var Getter = function(Getter) {
    Getter[Getter["f"] = obj.prop] = "f";
    return Getter;
}(Getter || {});
var Call = function(Call) {
    Call[Call["f"] = foo()] = "f";
    return Call;
}(Call || {});
var Incr = function(Incr) {
    Incr[Incr["f"] = x++] = "f";
    return Incr;
}(Incr || {});
var Arithmetics = function(Arithmetics) {
    Arithmetics[Arithmetics["f"] = x + 1] = "f";
    return Arithmetics;
}(Arithmetics || {});
var Combined = function(Combined) {
    Combined[Combined["a"] = obj.prop] = "a";
    Combined[Combined["b"] = foo()] = "b";
    Combined[Combined["c"] = x++] = "c";
    Combined[Combined["d"] = x + 1] = "d";
    return Combined;
}(Combined || {});
var WithPure = function(WithPure) {
    WithPure[WithPure["a"] = 1] = "a";
    WithPure[WithPure["f"] = foo()] = "f";
    return WithPure;
}(WithPure || {});
