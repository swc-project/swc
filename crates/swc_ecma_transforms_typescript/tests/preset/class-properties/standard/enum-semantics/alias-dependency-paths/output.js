(function(Constants) {
    (function(Nested) {
        (function(E) {
            E[E["A"] = 21] = "A";
        })(Nested.E || (Nested.E = {}));
    })(Constants.Nested || (Constants.Nested = {}));
})(Constants || (Constants = {}));
(function(Aliases) {
    Aliases.Through = Aliases.Forward.Nested;
    Aliases.MemberTerminal = Aliases.Forward.Nested.E.A;
    Aliases.Forward = Constants;
    Aliases.CycleA = Aliases.CycleB;
    Aliases.CycleB = Aliases.CycleA;
    Aliases.Missing = Aliases.Forward.Missing;
})(Aliases || (Aliases = {}));
const result = 21;
var Constants, Aliases;
