const example1 = (param)=>(param)=>param["There is something wrong!"];
const example2 = (param)=>(param)=>param["123 is fine"];
const example3 = (param)=>(param)=>param["! That is fine !"];
const example4 = (param)=>(param)=>param[" space in start works fine"];
const example5 = (param)=>(param)=>param[123];
class Foo extends Bar {
    foo() {
        super["a space b"]();
    }
}
export { example1, example2, example3, example4, example5, Foo };
