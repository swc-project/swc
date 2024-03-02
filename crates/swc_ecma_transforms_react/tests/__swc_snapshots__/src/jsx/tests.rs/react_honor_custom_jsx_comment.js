/** @jsx dom */ /*#__PURE__*/ dom(Foo, null);
var profile = /*#__PURE__*/ dom("div", null, /*#__PURE__*/ dom("img", {
    src: "avatar.png",
    className: "profile"
}), /*#__PURE__*/ dom("h3", null, [
    user.firstName,
    user.lastName
].join(" ")));
