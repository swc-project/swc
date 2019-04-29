class Foo {
    componentDidMount() {
        import(../foo/bar)
            .then(bar => {
                // bar should be {default: DEFAULT_EXPORTED_THING_IN_BAR} or atleast what it is supposed to be
            })
    }
}