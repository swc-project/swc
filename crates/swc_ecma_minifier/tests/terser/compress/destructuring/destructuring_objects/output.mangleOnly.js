{
    const { aa: a , bb: b  } = {
        aa: 1,
        bb: 2
    };
}{
    const { aa: c , bb: { cc: d , dd: e  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}{
    let { aa: f , bb: g  } = {
        aa: 1,
        bb: 2
    };
}{
    let { aa: h , bb: { cc: i , dd: j  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}var { aa: k , bb: l  } = {
    aa: 1,
    bb: 2
};
var { aa: k , bb: { cc: m , dd: n  } ,  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
};
