class Counter {
    add = (()=>{
        let count = 0;
        return (numToAdd)=>count += numToAdd;
    })();
    static{
        let count;
        this.helper = (count = 0, (numToAdd)=>count += numToAdd);
    }
    static method() {
        let count;
        return count = 0, (numToAdd)=>count += numToAdd;
    }
}
const counter1 = new Counter();
const counter2 = new Counter();
console.log(counter1.add(1)), console.log(counter2.add(1)), console.log(Counter.helper(1)), console.log(Counter.method()(1));
export { };
