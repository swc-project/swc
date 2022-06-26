((a)=>{
    a();
})(()=>((a)=>{
        a()().prop();
    })(()=>{
        let a = ()=>{
            var a = ()=>{
                console.log("PASS");
            }, b = ()=>{
                console.log;
                a();
            };
            return {
                prop: b
            };
        };
        return a;
    }));
