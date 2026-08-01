function TopLevelCtor(value) {
    this.value = value;
}
with (out.TopLevelCtor = TopLevelCtor, constructors)out.topLevel = new TopLevelCtor(1, 2, 3);
function constructLocal(constructors1) {
    function LocalCtor(value) {
        this.value = value;
    }
    with (constructors1)return new LocalCtor(1, 2, 3);
}
out.constructLocal = constructLocal;
