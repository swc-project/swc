const l = ()=>{
    let l;
    {
        let t = [];
        {
            console.log();
        }
        l = t;
        {
            let e = l;
            let o = 123456;
            console.log(o);
            e.push(o);
        }
    }
};
l();
