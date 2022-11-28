Yp.revoke, (a)=>Yp.config({
        aria: {
            mode: "checked"
        },
        ...ge(a, (e, t)=>"exclusive" !== t),
        onToggled: (c, d)=>{
            p(a.onToggled) && a.onToggled(c, d), ((e, f)=>{
                Or(e, th, {
                    item: e,
                    state: f
                });
            })(c, d);
        }
    });
