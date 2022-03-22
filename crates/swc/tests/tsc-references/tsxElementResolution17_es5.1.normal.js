//@filename: consumer.tsx
///<reference path="file.tsx" />
// Should keep s1 and elide s2
var s1 = require("elements1");
var s2 = require("elements2");
/*#__PURE__*/ React.createElement(s1.MyElement, null);
//@jsx: preserve
//@module: amd
//@filename: file.tsx
export { };
