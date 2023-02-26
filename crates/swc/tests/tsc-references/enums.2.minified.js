//// [/a.ts]
var SyntaxKind, SymbolFlags;
!function(SyntaxKind) {
    SyntaxKind[SyntaxKind.ImportClause = 0] = "ImportClause", SyntaxKind[SyntaxKind.ExportDeclaration = 1] = "ExportDeclaration";
}(SyntaxKind || (SyntaxKind = {})), function(SymbolFlags) {
    SymbolFlags.Type = "Type", SymbolFlags.Value = "Value";
}(SymbolFlags || (SymbolFlags = {}));
export { SymbolFlags };
//// [/b.ts]
SyntaxKind.ImportClause, SymbolFlags.Type;
export { };
//// [/c.ts]
import { SymbolFlags } from "./a";
SymbolFlags.Type;
