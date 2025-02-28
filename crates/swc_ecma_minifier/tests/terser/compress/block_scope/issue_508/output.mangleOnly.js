const l = ()=>{
    let l;
    {
        let o = [];
        {
            console.log();
        }
        l = o;
        {
            let e = l;
            let o = 123456;
            console.log(o);
            e.push(o);
        }
    }
};
l();
