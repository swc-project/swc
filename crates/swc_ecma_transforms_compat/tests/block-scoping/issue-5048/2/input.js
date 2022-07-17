class C extends D {
    mount() {
        let overrideFucNames = [
            "addChild",
            "addChildAt",
            "removeChild",
            "removeChildAt",
        ];
        for (let v of overrideFucNames) {
            setTimeout(() => super.mount(v));
        }
    }
}
