(() => {
    "use strict";
    class Element { }
    class PointElement extends Element {
        static id = 'point';
        constructor(cfg) {
            super();
        }
    }

    // var chart_elements = /*#__PURE__*/ Object.freeze({
    // PointElement: PointElement
    // });

    var chart_elements = /*#__PURE__*/(null && (Object.freeze({
        PointElement: PointElement
    })));

    const registerables = null && ([
        chart_elements,
        chart_plugins,
    ]);

    console.log('Done 1')
})()
    ;