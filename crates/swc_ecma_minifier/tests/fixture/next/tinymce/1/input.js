Yp.revoke, (e => Yp.config((e => ({
    aria: {
        mode: "checked"
    },
    ...ge(e, ((e, t) => "exclusive" !== t)),
    onToggled: (t, o) => {
        p(e.onToggled) && e.onToggled(t, o), ((e, t) => {
            Or(e, th, {
                item: e,
                state: t
            })
        })(t, o)
    }
}))(e)))