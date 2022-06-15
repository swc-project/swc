const a = ()=>{
    let a;
    {
        let b = [];
        {
            console.log();
        }
        a = b;
        {
            let c = a;
            let d = 123456;
            console.log(d);
            c.push(d);
        }
    }
};
a();
