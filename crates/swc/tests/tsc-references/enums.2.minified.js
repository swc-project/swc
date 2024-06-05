//// [/a.ts]
var SymbolFlags, SyntaxKind, SymbolFlags1;
(SyntaxKind = {})[SyntaxKind.ImportClause = 0] = "ImportClause", SyntaxKind[SyntaxKind.ExportDeclaration = 1] = "ExportDeclaration", (SymbolFlags1 = SymbolFlags = {}).Type = "Type", SymbolFlags1.Value = "Value";
export { SymbolFlags };
//// [/b.ts]
SyntaxKind.ImportClause, SymbolFlags.Type;
export { };
//// [/c.ts]
import { SymbolFlags } from './a';
SymbolFlags.Type;
