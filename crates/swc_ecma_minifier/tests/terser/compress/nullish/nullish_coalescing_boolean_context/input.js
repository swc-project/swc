if (null ?? unknown) {
    pass();
}
if (unknown ?? false) {
    pass();
}
if (4 + 4 ?? unknown) {
    pass();
}
