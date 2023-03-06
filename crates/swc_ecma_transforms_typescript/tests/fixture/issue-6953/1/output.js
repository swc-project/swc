import { tsUnknownKeywordTypeAnnotation } from "@internal/ast";
export default function TSUnknownKeywordTypeAnnotation(node, scope) {
    node = tsUnknownKeywordTypeAnnotation.assert(node);
    scope;
    throw new Error("unimplemented");
}
