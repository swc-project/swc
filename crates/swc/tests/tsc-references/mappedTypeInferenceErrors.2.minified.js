//// [mappedTypeInferenceErrors.ts]
foo({
    props: {
        x: 10,
        y: 20
    },
    computed: {
        bar: function() {
            return this.bar, 42;
        },
        baz: 42
    }
});
