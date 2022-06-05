define(["require", "./bar"], function (require, _bar) {
    "use strict";
    const makeX = () => {
        const _bar1 = () => (0, _bar.bar)();
        const alfa = () => _bar1();
        return {
            alfa,
        };
    };
});
