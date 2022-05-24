import _extends from "@swc/helpers/lib/_extends.js";
//@filename: app.tsx
import Main from "mod";
// Should see mod_1['default'] in emit here
/*#__PURE__*/ React.createElement(Foo, {
    handler: Main
});
// Should see mod_1['default'] in emit here
/*#__PURE__*/ React.createElement(Foo, _extends({}, Main));
