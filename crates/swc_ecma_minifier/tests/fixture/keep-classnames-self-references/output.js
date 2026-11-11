(()=>{
    let e = class StaticBlock {
        static{
            StaticBlock.prototype.ready = !0;
        }
    };
    console.log(e.name, new e().ready);
})(), (()=>{
    let e = class StaticField {
        static instance = new StaticField();
        static self = StaticField;
        getSelf() {
            return StaticField;
        }
    };
    console.log(e.name, e.instance instanceof e, e.self === e, e.instance.getSelf() === e);
})();
