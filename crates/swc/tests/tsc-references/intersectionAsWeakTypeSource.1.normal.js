//// [intersectionAsWeakTypeSource.ts]
var xy = {
    x: 'x',
    y: 10
};
var z1 = xy; // error, {xy} doesn't overlap with {z}
var wrapped = create({
    first: {
        view: 0,
        styleMedia: "???"
    }
});
var vs = wrapped.first // error, first is a branded number
;
