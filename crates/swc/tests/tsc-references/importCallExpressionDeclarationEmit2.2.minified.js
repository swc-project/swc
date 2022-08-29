//// [importCallExpressionDeclarationEmit2.ts]
//// [0.ts]
export function foo() {
    return "foo";
}
//// [1.ts]
import("./0");
