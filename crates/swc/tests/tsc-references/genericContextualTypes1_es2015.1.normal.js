const f00 = list;
const f01 = (x)=>[
        x
    ];
const f02 = wrap(list);
const f03 = wrap((x)=>[
        x
    ]);
const f10 = compose((a)=>list(a), (b)=>box(b));
const f11 = compose(list, box);
const f12 = compose((a)=>unbox(a), (b)=>unlist(b));
const f13 = compose(unbox, unlist);
const arrayMap = (f)=>(a)=>a.map(f);
const arrayFilter = (f)=>(a)=>a.filter(f);
const f20 = arrayMap((x)=>x.length);
const f21 = arrayMap((x)=>[
        x
    ]);
const f22 = arrayMap(identity);
const f23 = arrayMap((value)=>({
        value
    }));
const f30 = arrayFilter((x)=>x.length > 10);
const f31 = arrayFilter((x)=>x.value > 10);
const f40 = flip(zip);
const fn = (a)=>a;
