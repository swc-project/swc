function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @allowJs: true
// @checkJs: true
// @declaration: true
// @emitDeclarationOnly: true
// @Filename: vue.js
export var Vue = function Vue() {
    "use strict";
    _classCallCheck(this, Vue);
};
export var config = {
    x: 0
};
// Expando declarations aren't allowed on aliases.
Vue.config = {
};
new Vue();
// This is not an expando declaration; it's just a plain property assignment.
config.x = 1;
// This is not an expando declaration; it works because non-strict JS allows
// loosey goosey assignment on objects.
config.y = {
};
config.x;
config.y;
