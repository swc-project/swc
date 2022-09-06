{
    const { aa: a, bb: b } = { aa: 1, bb: 2 };
}
{
    const {
        aa: a,
        bb: { cc: b, dd: c },
    } = { aa: 1, bb: { cc: 2, dd: 3 } };
}
{
    let { aa: a, bb: b } = { aa: 1, bb: 2 };
}
{
    let {
        aa: a,
        bb: { cc: b, dd: c },
    } = { aa: 1, bb: { cc: 2, dd: 3 } };
}
var { aa: a, bb: b } = { aa: 1, bb: 2 };
var {
    aa: a,
    bb: { cc: c, dd: d },
} = { aa: 1, bb: { cc: 2, dd: 3 } };
