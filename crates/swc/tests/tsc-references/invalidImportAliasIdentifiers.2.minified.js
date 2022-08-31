//// [invalidImportAliasIdentifiers.ts]
var E;
!function(E) {
    E[E.Red = 0] = "Red", E[E.Blue = 1] = "Blue";
}(E || (E = {}));
export { };
