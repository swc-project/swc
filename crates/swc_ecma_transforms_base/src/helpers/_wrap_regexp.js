function _wrap_regexp(re, groups) {
    _wrap_regexp = function wrapRegExp(re, groups) {
        return new BabelRegExp(re, undefined, groups);
    };
    var _super = RegExp.prototype;
    var _groups = new WeakMap();
    function BabelRegExp(re, flags, groups) {
        var result = new RegExp(re, flags);
        _groups.set(result, groups || _groups.get(re));
        return _set_prototype_of(result, BabelRegExp.prototype);
    }
    function buildGroups(result, re) {
        var g = _groups.get(re);
        if (!g) {
            return result.groups;
        }
        var groups = Object.create(null);
        var keys = Object.keys(g);
        for (var i = 0; i < keys.length; i++) {
            var name = keys[i];
            var value = g[name];
            if (Array.isArray(value)) {
                var capture;
                for (var j = 0; j < value.length; j++) {
                    var match = result[value[j]];
                    if (match !== undefined) {
                        capture = match;
                        break;
                    }
                }
                groups[name] = capture;
            } else {
                groups[name] = result[value];
            }
        }
        return groups;
    }
    _inherits(BabelRegExp, RegExp);
    BabelRegExp.prototype.exec = function(str) {
        var result = _super.exec.call(this, str);
        if (result) {
            result.groups = buildGroups(result, this);
            if (result.indices && typeof result.indices === "object") {
                result.indices.groups = buildGroups(result.indices, this);
            }
        }
        return result;
    };
    if (typeof Symbol !== "undefined" && Symbol.replace) {
        BabelRegExp.prototype[Symbol.replace] = function(str, substitution) {
            if (typeof substitution === "string") {
                var groups = _groups.get(this);
                if (!groups) {
                    return _super[Symbol.replace].call(this, str, substitution);
                }
                return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)(>|$)/g, function(_, name, trailing) {
                    if (trailing === "") {
                        return "$<" + name;
                    }
                    var group = groups[name];
                    if (Array.isArray(group)) {
                        return group.map(function(group) {
                            return "$" + group;
                        }).join("");
                    }
                    return group == null ? "" : "$" + group;
                }));
            }
            if (typeof substitution === "function") {
                var _this = this;
                return _super[Symbol.replace].call(this, str, function() {
                    var args = arguments;
                    if (typeof args[args.length - 1] !== "object") {
                        args = Array.prototype.slice.call(args);
                        args.push(buildGroups(args, _this));
                    }
                    return substitution.apply(this, args);
                });
            }
            return _super[Symbol.replace].call(this, str, substitution);
        };
    }
    return _wrap_regexp(re, groups);
}
