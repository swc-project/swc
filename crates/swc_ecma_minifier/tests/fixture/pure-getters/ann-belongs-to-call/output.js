import { x } from "lib";
// A member expression shares `lo` with its object, so these annotations
// belong to the call. Claiming them for the read would drop `x()`.
/*#__PURE__*/ x().y, /*#__PURE__*/ x().y;
