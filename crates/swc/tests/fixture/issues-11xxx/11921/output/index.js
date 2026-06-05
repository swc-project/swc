const foo = ()=>(args)=>class A {
        };
new (foo()`bar`)();
const taggedObject = ()=>(args)=>({
            bar: (args)=>class B {
                }
        });
new (taggedObject()`a`.bar`b`)();
const nestedTag = ()=>(args)=>(args)=>class D {
            };
new (nestedTag()`a``b`)();
function Foo() {
    return (args)=>class C {
        };
}
new (new Foo)`bar`();
