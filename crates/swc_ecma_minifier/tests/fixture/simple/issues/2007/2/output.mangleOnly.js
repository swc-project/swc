function a() {
    (async ()=>{
        await this.foo();
        this.bar();
    })();
}
a();
