let positions = {
    top: 1,
    left: 2,
    right: 3,
    bottom: 4
}, rtlPositions = {
    top: 1,
    right: 2,
    left: 3,
    bottom: 4
};
export function PositionRender({ isRtl, position }) {
    let display = ('fe-fe-fe' === isRtl ? rtlPositions : positions)[position];
    return /*#__PURE__*/ React.createElement("h1", null, "PositionRender: ", display);
}
