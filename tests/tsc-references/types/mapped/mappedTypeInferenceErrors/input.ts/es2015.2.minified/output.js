foo({
    props: {
        x: 10,
        y: 20
    },
    computed: {
        bar () {
            return this.bar, 42;
        },
        baz: 42
    }
});
