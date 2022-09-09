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
            let t = 123456;
            console.log(t);
            e.push(t);
        }
    }
};
l();
