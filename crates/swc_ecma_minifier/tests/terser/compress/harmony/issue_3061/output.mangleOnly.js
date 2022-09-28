console.log(new (class extends (function(n) {
    return class extends n {
    };
})(Error) {
})() instanceof Error);
