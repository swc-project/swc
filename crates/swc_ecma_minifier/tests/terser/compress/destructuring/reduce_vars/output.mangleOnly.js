{
    const [a, [d, b]] = r;
}{
    let [a, [d, b]] = r;
}var [a, [d, b]] = r;
[a, [d, b]] = r;
{
    const { aa: a , bb: { cc: d , dd: b  }  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}{
    let { aa: a , bb: { cc: d , dd: b  }  } = {
        aa: 1,
        bb: {
            cc: 2,
            dd: 3
        }
    };
}var { aa: a , bb: { cc: b , dd: r  }  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
};
({ aa: a , bb: { cc: b , dd: r  }  } = {
    aa: 1,
    bb: {
        cc: 2,
        dd: 3
    }
});
const [{ a: n  }, o] = c;
let [{ d: s  }, t] = f;
var [{ g: e  }, l] = i;
[{ a: n  }, o] = c;
for(const [a, d] in pairs);
for(let [a, d] in pairs);
for(var [p, v] in pairs);
for([p, v] in pairs);
