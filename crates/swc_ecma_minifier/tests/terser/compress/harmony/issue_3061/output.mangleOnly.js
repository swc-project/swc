console.log(new (class extends (function(a) {
    return class extends a {
    };
})(Error) {
})() instanceof Error);
