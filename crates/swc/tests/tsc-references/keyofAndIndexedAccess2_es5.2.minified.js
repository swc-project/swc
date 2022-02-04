export function getAllEntities(state) {
    var ids = state.ids, entities = state.entities;
    return ids.map(function(id) {
        return entities[id];
    });
}
export function getEntity(id, state) {
    var ids = state.ids, entities = state.entities;
    if (ids.includes(id)) return entities[id];
}
export var c = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, c), this.a = "b", this.a = "b";
};
var actions = [
    "resizeTo",
    "resizeBy"
], _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _loop = function(_iterator, _step) {
        var action = _step.value;
        window[action] = function(x, y) {
            window[action](x, y);
        };
    }, _iterator = actions[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_loop(_iterator, _step);
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
