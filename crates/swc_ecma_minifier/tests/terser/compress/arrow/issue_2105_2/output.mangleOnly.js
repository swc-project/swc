((a)=>{
    a();
})(()=>((a)=>{
        a()().prop();
    })(()=>{
        let a = ()=>{
            var b = ()=>{
                console.log("PASS");
            }, a = ()=>{
                console.log;
                b();
            };
            return {
                prop: a
            };
        };
        return a;
    }));
