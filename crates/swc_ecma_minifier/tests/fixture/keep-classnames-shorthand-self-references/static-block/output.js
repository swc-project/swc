(()=>{
    let s = class Foo {
        static{
            Foo.refs = {
                Foo
            };
        }
    };
    console.log(s.name, s.refs.Foo === s);
})();
