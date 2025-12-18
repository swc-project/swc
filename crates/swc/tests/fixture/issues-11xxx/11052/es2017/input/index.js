class MyClass {
    constructor() {
        this._value = null;
    }

    async fetchData() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('Data fetched');
            }, 10);
        });
    }

    async fetchMoreData() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('More data fetched');
            }, 10);
        });
    }
    async initializeData() {
        this._value = await this.fetchData();
        this._value += ' ' + await this.fetchMoreData();
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
    }
}
async function func1() {
    let myClass = new MyClass();
    await myClass.initializeData();
    return myClass.value;
}
async function main() {
    let res = await func1();
    console.log(res);
}
main();
