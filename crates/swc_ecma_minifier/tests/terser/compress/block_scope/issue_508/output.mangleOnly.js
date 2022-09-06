const l = () => {
    let l;
    {
        let o = [];
        {
            console.log();
        }
        l = o;
        {
            let o = l;
            let e = 123456;
            console.log(e);
            o.push(e);
        }
    }
};
l();
