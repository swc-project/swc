const foo = () => {
    let a;
    {
        let b = [];
        {
            console.log();
        }
        a = b;
        {
            let c = a;
            let b = 123456;
            console.log(b);
            c.push(b);
        }
    }
};
foo();
