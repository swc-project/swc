{
    const { aa: a , bb: b  } = {
        aa: 1,
        bb: 2
    };
}{
    const { aa: c , bb: { cc: d , dd: _  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}{
    let { aa: t , bb: e  } = {
        aa: 1,
        bb: 2
    };
}{
    let { aa: l , bb: { cc: n , dd: o  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}var { aa: r , bb: s  } = {
    aa: 1,
    bb: 2
};
var { aa: r , bb: { cc: v , dd: f  } ,  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
};
