import { Scope } from "../../scopes";
import {
    AnyNode,
    TSUnknownKeywordTypeAnnotation,
    tsUnknownKeywordTypeAnnotation,
} from "@internal/ast";

export default function TSUnknownKeywordTypeAnnotation(
    node: AnyNode,
    scope: Scope,
) {
    node = tsUnknownKeywordTypeAnnotation.assert(node);
    scope;
    throw new Error("unimplemented");
}