function func() {
    (async () => {
        await this.foo();
        this.bar();
    })();
}

func();
