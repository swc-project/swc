(()=>{
    let s = class Foo {
        static refs = {
            Foo
        };
    };
    console.log(s.name, s.refs.Foo === s);
})();
