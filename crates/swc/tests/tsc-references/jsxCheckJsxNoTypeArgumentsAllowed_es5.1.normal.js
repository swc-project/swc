// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
// @allowJs: true
// @outDir: ./out
// @checkJs: true
// @filename: component.d.ts
import * as React from "react";
// @filename: file.jsx
import { MyComp } from "./component";
import * as React from "react";
var x = /*#__PURE__*/ React.createElement(MyComp, {
    a: 10,
    b: "hi"
}); // error, no type arguments in js
