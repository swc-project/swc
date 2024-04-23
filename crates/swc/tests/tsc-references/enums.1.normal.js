//// [/a.ts]
var SyntaxKind;
(function(SyntaxKind) {
    SyntaxKind[SyntaxKind["ImportClause"] = 0] = "ImportClause";
    SyntaxKind[SyntaxKind["ExportDeclaration"] = 1] = "ExportDeclaration";
})(SyntaxKind || (SyntaxKind = {}));
var SymbolFlags;
(function(SymbolFlags) {
    SymbolFlags["Type"] = "Type";
    SymbolFlags["Value"] = "Value";
})(SymbolFlags || (SymbolFlags = {}));
export { SymbolFlags };
//// [/b.ts]
SyntaxKind.ImportClause;
SymbolFlags.Type;
var kind;
var flags;
export { };
//// [/c.ts]
import { SymbolFlags } from './a';
var flags = SymbolFlags.Type;
