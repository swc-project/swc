function f15(x) {
    x.error ? x.error.message : x.value;
}
f15({
    value: 10
}), f15({
    error: Error("boom")
});
