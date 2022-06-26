{
    const { aa: aa , bb: bb  } = {
        aa: 1,
        bb: 2
    };
}{
    const { aa: aa1 , bb: { cc: cc , dd: dd  }  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}{
    let { aa: aa2 , bb: bb1  } = {
        aa: 1,
        bb: 2
    };
}{
    let { aa: aa3 , bb: { cc: cc1 , dd: dd1  }  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}var { aa: aa4 , bb: bb2  } = {
    aa: 1,
    bb: 2
};
var { aa: aa4 , bb: { cc: cc2 , dd: dd2  }  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
};
