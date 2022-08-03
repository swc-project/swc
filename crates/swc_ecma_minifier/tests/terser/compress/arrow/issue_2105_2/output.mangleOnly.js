((r)=>{
    r();
})(()=>((r)=>{
        r()().prop();
    })(()=>{
        let r = ()=>{
            var r = ()=>{
                console.log("PASS");
            }, o = ()=>{
                console.log;
                r();
            };
            return {
                prop: o
            };
        };
        return r;
    }));
