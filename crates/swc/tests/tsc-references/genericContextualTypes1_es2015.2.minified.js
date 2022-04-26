wrap(list), wrap((x)=>[
        x
    ]
), compose((a)=>list(a)
, (b)=>box(b)
), compose(list, box), compose((a)=>unbox(a)
, (b)=>unlist(b)
), compose(unbox, unlist);
const arrayMap = (f)=>(a)=>a.map(f)
, arrayFilter = (f)=>(a)=>a.filter(f)
;
arrayMap((x)=>x.length
), arrayMap((x)=>[
        x
    ]
), arrayMap(identity), arrayMap((value)=>({
        value
    })
), arrayFilter((x)=>x.length > 10
), arrayFilter((x)=>x.value > 10
), flip(zip);
