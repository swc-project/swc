const xy = {
    x: 'x',
    y: 10
};
const z1 = xy; // error, {xy} doesn't overlap with {z}
const wrapped = create({
    first: {
        view: 0,
        styleMedia: "???"
    }
});
const vs = wrapped.first // error, first is a branded number
;
