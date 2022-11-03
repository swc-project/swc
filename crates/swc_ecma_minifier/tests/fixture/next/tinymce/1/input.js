Yp.revoke, (a => Yp.config((b => ({
    aria: {
        mode: "checked"
    },
    ...ge(b, ((e, t) => "exclusive" !== t)),
    onToggled: (c, d) => {
        p(b.onToggled) && b.onToggled(c, d), ((e, f) => {
            Or(e, th, {
                item: e,
                state: f
            })
        })(c, d)
    }
}))(a)))