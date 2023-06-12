Yp.revoke, (a)=>{
    var b;
    return Yp.config((b = a, {
        aria: {
            mode: "checked"
        },
        ...ge(b, (e, t)=>"exclusive" !== t),
        onToggled: (c, d)=>{
            p(b.onToggled) && b.onToggled(c, d), ((e, f)=>{
                Or(e, th, {
                    item: e,
                    state: f
                });
            })(c, d);
        }
    }));
};
