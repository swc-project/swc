class KeepThis {
    static field = this.make();
}
class KeepSuper extends Base {
    static field = super.make();
}
class KeepSelfValue {
    static field = KeepSelfValue.make();
}
class KeepSelfBlock {
    static{
        KeepSelfBlock.make();
    }
}
class KeepPrivateInBlock {
    static #value;
    static{
        #value in getObject();
    }
}
class KeepPrivateAccessInBlock {
    static #value;
    static{
        getObject().#value;
    }
}
class KeepMultiStatementBlock {
    static{
        first();
        second();
    }
}
class KeepNonExpressionBlock {
    static{
        if (flag) effect();
    }
}
