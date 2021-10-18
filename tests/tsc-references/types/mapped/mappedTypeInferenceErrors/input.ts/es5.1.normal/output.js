foo({
    props: {
        x: 10,
        y: 20
    },
    computed: {
        bar: function() {
            var z = this.bar;
            return 42;
        },
        baz: 42
    }
});
