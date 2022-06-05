define(["require", "./Bar"], function (require, _bar1) {
    "use strict";
    const makeX = (props) => {
        const _bar = props.bar;
        const { list } = _bar;
        return list.map(() => _bar1.bar);
    };
});
