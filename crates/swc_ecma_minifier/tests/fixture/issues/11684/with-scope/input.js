function TopLevelCtor(value) {
    this.value = value;
}

out.TopLevelCtor = TopLevelCtor;

with (constructors) {
    out.topLevel = new TopLevelCtor(1, 2, 3);
}

function constructLocal(constructors) {
    function LocalCtor(value) {
        this.value = value;
    }

    with (constructors) {
        return new LocalCtor(1, 2, 3);
    }
}

out.constructLocal = constructLocal;
