//// [/a.ts]
var SyntaxKind, SyntaxKind1 = ((SyntaxKind = SyntaxKind1 || {})[SyntaxKind.ImportClause = 0] = "ImportClause", SyntaxKind[SyntaxKind.ExportDeclaration = 1] = "ExportDeclaration", SyntaxKind);
export { SymbolFlags };
//// [/b.ts]
SyntaxKind.ImportClause, SymbolFlags.Type;
export { };
//// [/c.ts]
import { SymbolFlags } from './a';
SymbolFlags.Type;
