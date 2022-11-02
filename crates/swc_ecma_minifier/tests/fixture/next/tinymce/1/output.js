Yp.revoke, (a)=>Yp.config({
        aria: {
            mode: "checked"
        },
        ...ge(a, (e, t)=>"exclusive" !== t),
        onToggled (c, d) {
            p(a.onToggled) && a.onToggled(c, d), Or(c, th, {
                item: c,
                state: d
            });
        }
    });
