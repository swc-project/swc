const decideZoomByAccuracy = (range) => {
    const isUnder = (accuracy) => {
        return range <= accuracy;
    };
    if (isUnder(0)) {
        return 15;
    }
    if (isUnder(50)) {
        return 15;
    }
    if (isUnder(100)) {
        return 15;
    }
    return 11;
};
export const zoom = decideZoomByAccuracy(75);
