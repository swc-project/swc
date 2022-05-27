const a = ()=>{
    let a;
    {
        let c = [];
        {
            console.log();
        }
        a = c;
        {
            let d = a;
            let b = 123456;
            console.log(b);
            d.push(b);
        }
    }
};
a();
