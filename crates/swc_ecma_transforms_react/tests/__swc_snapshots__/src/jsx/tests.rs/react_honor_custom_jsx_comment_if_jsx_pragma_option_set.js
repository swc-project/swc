/** @jsx dom */ /*#__PURE__*/ import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
_jsx(Foo, {});
var profile = /*#__PURE__*/ _jsxs("div", {
    children: [
        /*#__PURE__*/ _jsx("img", {
            src: "avatar.png",
            className: "profile"
        }),
        /*#__PURE__*/ _jsx("h3", {
            children: [
                user.firstName,
                user.lastName
            ].join(" ")
        })
    ]
});
