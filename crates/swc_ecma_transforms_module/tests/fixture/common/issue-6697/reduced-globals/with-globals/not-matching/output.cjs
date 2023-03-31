"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Hello: ()=>Hello,
    World: ()=>World
});
const _sparkle = /*#__PURE__*/ _interopRequireDefault(require("@themagician/sparkle"));
const _worldLevel = /*#__PURE__*/ _interopRequireDefault(require("./worldLevel"));
const _stormJs = /*#__PURE__*/ _interopRequireDefault(require("./storm.js"));
const _phenomenaLevels = /*#__PURE__*/ _interopRequireDefault(require("./phenomena.levels"));
const _indexJs = /*#__PURE__*/ _interopRequireDefault(require("./some/index.js"));
const _ = /*#__PURE__*/ _interopRequireDefault(require("."));
const _1 = /*#__PURE__*/ _interopRequireDefault(require(".."));
class Hello {
    message(to) {
        console.log(`Hello ${to.toString()}!`);
    }
}
class World {
    runExperiement() {
        const seed = (0, _stormJs.default)((0, _worldLevel.default)(), (0, _phenomenaLevels.default)());
        (0, _1.default)((0, _.default)((0, _indexJs.default)()));
        (0, _sparkle.default)(seed);
    }
    toString() {
        return `World ${(0, _worldLevel.default)()} ${(0, _stormJs.default)()}`;
    }
}
