((o)=>{
    o();
})(()=>((o)=>{
        o()().prop();
    })(()=>{
        let o = ()=>{
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
        return o;
    }));
