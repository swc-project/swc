(()=>{
    let o = class Foo {
        static{
            try {
                ({ Foo = null } = {});
            } catch (o) {
                console.log(o instanceof TypeError);
            }
        }
    };
    console.log(o.name);
})();
