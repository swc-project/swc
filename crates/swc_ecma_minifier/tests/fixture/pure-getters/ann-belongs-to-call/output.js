import { x } from "lib";
// A member expression starts where its object starts, so this comment is
// equally "before" `x()` and `x().y`. It belongs to the call, which is
// what the user wrote it next to and which already knows how to consume
// it. Claiming it for the property read instead would drop `x()`.
/*#__PURE__*/ x().y, // A parenthesized call object owns the annotation for the same reason.
/*#__PURE__*/ x().y;
