{
    const { aa: aa, bb: bb } = { aa: 1, bb: 2 };
}
{
    const {
        aa: aa,
        bb: { cc: cc, dd: dd },
    } = { aa: 1, bb: { cc: 2, dd: 3 } };
}
{
    let { aa: aa, bb: bb } = { aa: 1, bb: 2 };
}
{
    let {
        aa: aa,
        bb: { cc: cc, dd: dd },
    } = { aa: 1, bb: { cc: 2, dd: 3 } };
}
var { aa: aa, bb: bb } = { aa: 1, bb: 2 };
var {
    aa: aa,
    bb: { cc: cc, dd: dd },
} = { aa: 1, bb: { cc: 2, dd: 3 } };
