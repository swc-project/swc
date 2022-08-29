//// [infiniteExpansionThroughTypeInference.ts]
function ff(g) {
    ff(g) // when infering T here we need to make sure to not descend into the structure of G<T> infinitely
    ;
}
