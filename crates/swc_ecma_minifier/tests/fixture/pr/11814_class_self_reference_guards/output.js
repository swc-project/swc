let throws = 0;
try {
    class ExtendsSelf extends ExtendsSelf {}
} catch (e) {
    throws++;
}
try {
    class ComputedMethodSelf {
        [ComputedMethodSelf]() {}
    }
} catch (e) {
    throws++;
}
try {
    class ComputedFieldSelf {
        [ComputedFieldSelf] = 1;
    }
} catch (e) {
    throws++;
}
sink(throws);
