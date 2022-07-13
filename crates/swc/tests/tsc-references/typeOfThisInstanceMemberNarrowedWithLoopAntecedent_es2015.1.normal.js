// #31995
class SomeClass {
    method() {
        while(0){}
        this.state.data;
        if (this.state.type === "stringVariant") {
            const s = this.state.data;
        }
    }
}
class SomeClass2 {
    method() {
        var ref;
        const c = false;
        while(c){}
        if (this.state.type === "numberVariant") {
            this.state.data;
        }
        let n = (ref = this.state) === null || ref === void 0 ? void 0 : ref.data; // This should be an error
    }
}
