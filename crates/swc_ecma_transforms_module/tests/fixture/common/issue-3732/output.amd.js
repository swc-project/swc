define(["require", "exports", "./get"], function (require, _exports, _get) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true,
    });
    __export(_exports, {
        byID: function () {
            return byID;
        },
        get: function () {
            return _get;
        },
    });
    _get = __toESM(_get);
    const byID = (id) => {
        // Do some async stuff
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve("result");
            }, 2000)
        );
    };
});
