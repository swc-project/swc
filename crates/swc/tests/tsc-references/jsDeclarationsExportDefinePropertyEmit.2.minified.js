//// [index.js]
Object.defineProperty(module.exports, "a", {
    value: function() {}
}), Object.defineProperty(module.exports, "b", {
    value: function() {}
}), Object.defineProperty(module.exports.b, "cat", {
    value: "cat"
}), Object.defineProperty(module.exports, "d", {
    value: function(a, b) {
        return null;
    }
}), Object.defineProperty(module.exports, "e", {
    value: function(a, b) {
        return null;
    }
}), Object.defineProperty(module.exports, "f", {
    value: function(a) {
        return a;
    }
}), Object.defineProperty(module.exports.f, "self", {
    value: module.exports.f
}), Object.defineProperty(module.exports, "g", {
    value: function(a, b) {
        return a.x && b.y();
    }
}), Object.defineProperty(module.exports, "h", {
    value: function(a, b) {
        return a.x && b.y();
    }
}), Object.defineProperty(module.exports, "i", {
    value: function() {}
}), Object.defineProperty(module.exports, "ii", {
    value: module.exports.i
}), Object.defineProperty(module.exports, "jj", {
    value: module.exports.j
}), Object.defineProperty(module.exports, "j", {
    value: function() {}
});
