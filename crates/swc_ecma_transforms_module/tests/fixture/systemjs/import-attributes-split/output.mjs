System.register([
    "./data.js",
    "./data.js",
    "./data.js",
    "./empty.js"
], function(_export, _context) {
    "use strict";
    var alsoPlain, emptyWith, noWith, plain, withJson, withNamed, withOther;
    _export({
        alsoPlain: void 0,
        emptyWith: void 0,
        noWith: void 0,
        plain: void 0,
        withJson: void 0,
        withNamed: void 0,
        withOther: void 0
    });
    return {
        setters: [
            function(_data_ns) {
                alsoPlain = _data_ns.alsoPlain;
                _export("alsoPlain", alsoPlain);
                plain = _data_ns.plain;
                _export("plain", plain);
            },
            function(_data_ns) {
                withJson = _data_ns.default;
                _export("withJson", withJson);
                withNamed = _data_ns.withNamed;
                _export("withNamed", withNamed);
            },
            function(_data_ns) {
                withOther = _data_ns.default;
                _export("withOther", withOther);
            },
            function(_empty_ns) {
                emptyWith = _empty_ns.emptyWith;
                _export("emptyWith", emptyWith);
                noWith = _empty_ns.noWith;
                _export("noWith", noWith);
            }
        ],
        execute: function() {}
    };
}, [
    {},
    {
        assert: {
            type: "json"
        }
    },
    {
        assert: {
            type: "custom"
        }
    },
    {}
]);
