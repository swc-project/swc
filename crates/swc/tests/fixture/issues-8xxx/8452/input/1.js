class Test0 { }

class Test extends Test0 {
    constructor() {
        super(),
            console.log(async (e) => {
                await this.test();
            });
    }
}
