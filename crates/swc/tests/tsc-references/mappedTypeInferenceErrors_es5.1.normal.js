// @strict: true
// Repro from #19316
foo({
    props: {
        x: 10,
        y: 20
    },
    computed: {
        bar: function bar() {
            var z = this.bar;
            return 42;
        },
        baz: 42
    }
});
