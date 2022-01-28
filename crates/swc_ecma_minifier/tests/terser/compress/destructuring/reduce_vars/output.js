{
    const [aa, [bb, cc]] = dd;
}{
    let [aa, [bb, cc]] = dd;
}var [aa, [bb, cc]] = dd;
[aa, [bb, cc]] = dd;
{
    const { aa: aa , bb: { cc: cc , dd: dd  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}{
    let { aa: aa , bb: { cc: cc , dd: dd  } ,  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}var { aa: aa , bb: { cc: cc , dd: dd  } ,  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
};
({ aa: aa , bb: { cc: cc , dd: dd  } ,  } = {
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
