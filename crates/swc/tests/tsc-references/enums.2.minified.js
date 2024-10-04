//// [/a.ts]
var SyntaxKind, SymbolFlags, SyntaxKind1 = ((SyntaxKind = SyntaxKind1 || {})[SyntaxKind.ImportClause = 0] = "ImportClause", SyntaxKind[SyntaxKind.ExportDeclaration = 1] = "ExportDeclaration", SyntaxKind), SymbolFlags1 = ((SymbolFlags = SymbolFlags1 || {}).Type = "Type", SymbolFlags.Value = "Value", SymbolFlags);
export { SymbolFlags1 as SymbolFlags };
//// [/b.ts]
SyntaxKind.ImportClause, SymbolFlags.Type;
export { };
//// [/c.ts]
import { SymbolFlags } from './a';
SymbolFlags.Type;
