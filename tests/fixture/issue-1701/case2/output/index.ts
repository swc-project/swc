var f = function() {
    for(var _len = arguments.length, characters = new Array(_len), _key = 0; _key < _len; _key++){
        characters[_key] = arguments[_key];
    }
    return characters.length;
};
var g = function(str) {
    return f.apply(void 0, str);
};
g("meow");
