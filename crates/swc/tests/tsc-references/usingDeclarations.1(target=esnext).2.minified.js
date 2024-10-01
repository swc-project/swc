//// [usingDeclarations.1.ts]
var N;
using d1 = {
    [Symbol.dispose] () {}
}
class C1 {
    constructor(){
        this.a = ()=>{
            using d7 = {
                [Symbol.dispose] () {}
            }
        };
        using d8 = {
            [Symbol.dispose] () {}
        }
    }
    static{
        using d9 = {
            [Symbol.dispose] () {}
        }
    }
    m() {
        using d10 = {
            [Symbol.dispose] () {}
        }
    }
    get x() {
        using d11 = {
            [Symbol.dispose] () {}
        }
        return 0;
    }
    set x(v) {
        using d12 = {
            [Symbol.dispose] () {}
        }
    }
    async am() {
        using d13 = {
            [Symbol.dispose] () {}
        }
        await null;
    }
    *g() {
        using d14 = {
            [Symbol.dispose] () {}
        }
        yield;
    }
    async *ag() {
        using d15 = {
            [Symbol.dispose] () {}
        }
        yield, await null;
    }
}
!function(N) {
    using d18 = {
        [Symbol.dispose] () {}
    }
}(N || (N = {}));
using d19 = {
    [Symbol.dispose] () {}
}
switch(Math.random()){
    case 0:
        using d20 = {
            [Symbol.dispose] () {}
        }
        break;
    case 1:
        using d21 = {
            [Symbol.dispose] () {}
        }
}
using d22 = {
    [Symbol.dispose] () {}
}
try {
    using d23 = {
        [Symbol.dispose] () {}
    }
} catch  {
    using d24 = {
        [Symbol.dispose] () {}
    }
} finally{
    using d25 = {
        [Symbol.dispose] () {}
    }
}
using d26 = {
    [Symbol.dispose] () {}
}
for(;;){
    using d28 = {
        [Symbol.dispose] () {}
    }
    break;
}
for(;;){
    using d29 = {
        [Symbol.dispose] () {}
    }
    break;
}
for(;;){
    using d30 = {
        [Symbol.dispose] () {}
    }
    break;
}
for(let x in {})using d31 = {
    [Symbol.dispose] () {}
}
for (let x of [])using d32 = {
    [Symbol.dispose] () {}
}
export { };
