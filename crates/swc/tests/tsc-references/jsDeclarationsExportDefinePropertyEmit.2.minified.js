//// [index.js]
Object.defineProperty(module.exports, "a", {
    value: function() {}
}), Object.defineProperty(module.exports, "b", {
    value: function() {}
}), Object.defineProperty(module.exports.b, "cat", {
    value: "cat"
}), Object.defineProperty(module.exports, "d", {
    value: /**
 * @param {number} a
 * @param {number} b
 * @return {string} 
 */ function(a, b) {
        return /** @type {*} */ null;
    }
}), Object.defineProperty(module.exports, "e", {
    value: /**
 * @template T,U
 * @param {T} a
 * @param {U} b
 * @return {T & U} 
 */ function(a, b) {
        return /** @type {*} */ null;
    }
}), Object.defineProperty(module.exports, "f", {
    value: /**
 * @template T
 * @param {T} a
 */ function(a) {
        return a;
    }
}), Object.defineProperty(module.exports.f, "self", {
    value: module.exports.f
}), Object.defineProperty(module.exports, "g", {
    value: /**
 * @param {{x: string}} a
 * @param {{y: typeof module.exports.b}} b
 */ function(a, b) {
        return a.x && b.y();
    }
}), Object.defineProperty(module.exports, "h", {
    value: /**
 * @param {{x: string}} a
 * @param {{y: typeof module.exports.b}} b
 */ function(a, b) {
        return a.x && b.y();
    }
}), Object.defineProperty(module.exports, "i", {
    value: function() {}
}), Object.defineProperty(module.exports, "ii", {
    value: module.exports.i
}), // note that this last one doesn't make much sense in cjs, since exports aren't hoisted bindings
Object.defineProperty(module.exports, "jj", {
    value: module.exports.j
}), Object.defineProperty(module.exports, "j", {
    value: function() {}
});
