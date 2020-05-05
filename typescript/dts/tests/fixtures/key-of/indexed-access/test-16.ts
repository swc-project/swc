// Repro from #13749

class Form<T> {
    private childFormFactories: { [K in keyof T]: (v: T[K]) => Form<T[K]> };

    public set<K extends keyof T>(prop: K, value: T[K]) {
        this.childFormFactories[prop](value)
    }
}

