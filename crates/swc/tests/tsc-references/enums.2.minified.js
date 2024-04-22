//// [/a.ts]
var SyntaxKind, SymbolFlags, SyntaxKind1, SymbolFlags1;
(SyntaxKind1 = SyntaxKind || (SyntaxKind = {}))[SyntaxKind1.ImportClause = 0] = "ImportClause", SyntaxKind1[SyntaxKind1.ExportDeclaration = 1] = "ExportDeclaration", (SymbolFlags1 = SymbolFlags || (SymbolFlags = {})).Type = "Type", SymbolFlags1.Value = "Value";
export { SymbolFlags };
//// [/b.ts]
SyntaxKind.ImportClause, SymbolFlags.Type;
export { };
//// [/c.ts]
import { SymbolFlags } from './a';
SymbolFlags.Type;
