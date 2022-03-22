import * as swcHelpers from "@swc/helpers";
//@filename: app.tsx
import Main from "mod";
// Should see mod_1['default'] in emit here
/*#__PURE__*/ React.createElement(Foo, {
    handler: Main
});
// Should see mod_1['default'] in emit here
/*#__PURE__*/ React.createElement(Foo, swcHelpers.extends({}, Main));
