f1((a, b, c)=>{}), f1((...x)=>{}), f1((a, ...x)=>{}), f1((a, b, ...x)=>{}), f1((a, b, c, ...x)=>{}), f2((a, b, c)=>{}), f2((...x)=>{}), f2((a, ...x)=>{}), f2((a, b, ...x)=>{}), f2((a, b, c, ...x)=>{}), f3((a, b, c)=>{}), f3((...x)=>{}), f3((a, ...x)=>{}), f3((a, b, ...x)=>{}), f3((a, b, c, ...x)=>{}), f5(()=>"hello"
), f5((x, y)=>42
), f5((x, y)=>42
), f5((x, y)=>x + y
), f5((...args)=>!0
), pipe(()=>!0
, (b)=>42
), pipe((x)=>"hello"
, (s)=>s.length
), pipe((x, y)=>42
, (x)=>"" + x
), pipe((x, y)=>42
, (x)=>"" + x
), take(function(...rest) {}), (...params)=>{
    const [num, strOrErr] = params;
    return num;
};
