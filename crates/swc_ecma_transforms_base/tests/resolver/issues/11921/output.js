const foo__2 = ()=>(args__3)=>class A__4 {
        };
new (foo__2()`bar`)();
const taggedObject__2 = ()=>(args__5)=>({
            bar: (args__6)=>class B__7 {
                }
        });
new (taggedObject__2()`a`.bar`b`)();
const nestedTag__2 = ()=>(args__8)=>(args__9)=>class D__10 {
            };
new (nestedTag__2()`a``b`)();
function Foo__2() {
    return (args__12)=>class C__13 {
        };
}
new (new Foo__2)`bar`();
