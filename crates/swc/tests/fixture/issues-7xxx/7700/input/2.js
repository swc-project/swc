
const positions = {
    top: 1,
    left: 2,
    right: 3,
    bottom: 4,
}

const rtlPositions = {
    top: 1,
    right: 2,
    left: 3,
    bottom: 4,
}

export function PositionRender({ isRtl, position }) {

    const display = (isRtl === 'fe-fe-fe' ? [rtlPositions] : { positions })[position];

    return <h1>
        PositionRender: {display}
    </h1>
}