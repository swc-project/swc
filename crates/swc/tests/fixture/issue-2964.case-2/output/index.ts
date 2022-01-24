"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.downloadDocument = exports.badIstanbul = exports.noop = void 0;
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
//top comment
const noop = ()=>{};
exports.noop = noop;
var /* istanbul ignore next */ badIstanbul = (test)=>{
    const { value  } = test, pixelParams = _objectWithoutProperties(test, [
        "value"
    ]);
    console.log('fail');
};
exports.badIstanbul = badIstanbul;
/* istanbul ignore next: UI-5137 */ const downloadDocument = ()=>{
    console.log('fail');
};
exports.downloadDocument = downloadDocument;
