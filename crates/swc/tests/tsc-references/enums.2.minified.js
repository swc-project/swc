//// [/a.ts]
var SyntaxKind, SymbolFlags, SyntaxKind1;
(SyntaxKind1 = SyntaxKind || (SyntaxKind = {}))[SyntaxKind1.ImportClause = 0] = "ImportClause", SyntaxKind1[SyntaxKind1.ExportDeclaration = 1] = "ExportDeclaration";
export { SymbolFlags };
//// [/b.ts]
SyntaxKind.ImportClause, SymbolFlags.Type;
export { };
//// [/c.ts]
import { SymbolFlags } from "./a";
SymbolFlags.Type;
