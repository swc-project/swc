const foo__2 = ()=>(args__4)=>class A__5 {
        };
new (foo__2()`bar`)();
const taggedObject__2 = ()=>(args__7)=>({
            bar: (args__8)=>class B__9 {
                }
        });
new (taggedObject__2()`a`.bar`b`)();
const nestedTag__2 = ()=>(args__11)=>(args__12)=>class D__13 {
            };
new (nestedTag__2()`a``b`)();
function Foo__2() {
    return (args__15)=>class C__16 {
        };
}
new (new Foo__2)`bar`();
