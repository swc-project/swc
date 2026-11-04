export class StaticTestClass {
}
StaticTestClass.testProp = "Hello world!";
StaticTestClass.testMethod = ()=>{
    console.log(StaticTestClass.testProp);
};
