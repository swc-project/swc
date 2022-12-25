define([
    "require",
    "exports",
    "@themagician/sparkle",
    "./worldLevel",
    "./storm.js",
    "./phenomena.levels",
    "./some/index.js",
    ".",
    ".."
], function(require, exports, _sparkle, _worldLevel, _stormJs, _phenomenaLevels, _indexJs, _, _1) {
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
    _sparkle = /*#__PURE__*/ _interopRequireDefault(_sparkle);
    _worldLevel = /*#__PURE__*/ _interopRequireDefault(_worldLevel);
    _stormJs = /*#__PURE__*/ _interopRequireDefault(_stormJs);
    _phenomenaLevels = /*#__PURE__*/ _interopRequireDefault(_phenomenaLevels);
    _indexJs = /*#__PURE__*/ _interopRequireDefault(_indexJs);
    _ = /*#__PURE__*/ _interopRequireDefault(_);
    _1 = /*#__PURE__*/ _interopRequireDefault(_1);
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
});
