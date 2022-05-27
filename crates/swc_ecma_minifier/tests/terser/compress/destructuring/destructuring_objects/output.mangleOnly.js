{
    const { aa: b , bb: c  } = {
        aa: 1,
        bb: 2
    };
}{
    const { aa: d , bb: { cc: e , dd: f  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}{
    let { aa: g , bb: h  } = {
        aa: 1,
        bb: 2
    };
}{
    let { aa: i , bb: { cc: j , dd: k  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}var { aa: a , bb: l  } = {
    aa: 1,
    bb: 2
};
var { aa: a , bb: { cc: m , dd: n  } ,  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
};
