(() => {
    class StaticBlock {
        static {
            StaticBlock.prototype.ready = true;
        }
    }

    console.log(StaticBlock.name, new StaticBlock().ready);
})();

(() => {
    class StaticField {
        static instance = new StaticField();
        static self = StaticField;

        getSelf() {
            return StaticField;
        }
    }

    console.log(
        StaticField.name,
        StaticField.instance instanceof StaticField,
        StaticField.self === StaticField,
        StaticField.instance.getSelf() === StaticField
    );
})();
