{
    const [aa, [bb, cc]] = dd2;
}{
    let [aa1, [bb1, cc1]] = dd2;
}var [aa2, [bb2, cc2]] = dd2;
[aa2, [bb2, cc2]] = dd2;
{
    const { aa: aa3 , bb: { cc: cc3 , dd: dd  }  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}{
    let { aa: aa4 , bb: { cc: cc4 , dd: dd1  }  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}var { aa: aa2 , bb: { cc: cc2 , dd: dd2  }  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
};
({ aa: aa2 , bb: { cc: cc2 , dd: dd2  }  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
});
const [{ a: a  }, b] = c;
let [{ d: d  }, e] = f;
var [{ g: g  }, h] = i;
[{ a: a  }, b] = c;
for(const [x, y] in pairs);
for(let [x1, y1] in pairs);
for(var [x2, y2] in pairs);
for([x2, y2] in pairs);
