export let example1 = (param)=>(param)=>param["There is something wrong!"];
export let example2 = (param)=>(param)=>param["123 is fine"];
export let example3 = (param)=>(param)=>param["! That is fine !"];
export let example4 = (param)=>(param)=>param[" space in start works fine"];
export let example5 = (param)=>(param)=>param[123];
export class Foo extends Bar {
    foo() {
        super["a space b"]();
    }
}
