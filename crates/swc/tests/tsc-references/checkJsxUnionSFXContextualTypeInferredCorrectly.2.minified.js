//// [checkJsxUnionSFXContextualTypeInferredCorrectly.tsx]
import React from 'react';
export function ComponentWithUnion(props) {
    return /*#__PURE__*/ React.createElement("h1", null);
}
export function HereIsTheError() {
    return /*#__PURE__*/ React.createElement(ComponentWithUnion, {
        multi: !1,
        value: 's',
        onChange: function(val) {
            return console.log(val);
        }
    });
}
ComponentWithUnion({
    multi: !1,
    value: 's',
    onChange: function(val) {
        return console.log(val);
    }
});
