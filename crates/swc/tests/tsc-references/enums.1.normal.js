//// [/a.ts]
var SyntaxKind = /*#__PURE__*/ function(SyntaxKind) {
    SyntaxKind[SyntaxKind["ImportClause"] = 0] = "ImportClause";
    SyntaxKind[SyntaxKind["ExportDeclaration"] = 1] = "ExportDeclaration";
    return SyntaxKind;
}(SyntaxKind || {});
var SymbolFlags = /*#__PURE__*/ function(SymbolFlags) {
    SymbolFlags["Type"] = "Type";
    SymbolFlags["Value"] = "Value";
    return SymbolFlags;
}(SymbolFlags || {});
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
