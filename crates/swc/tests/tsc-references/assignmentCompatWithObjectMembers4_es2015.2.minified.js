var OnlyDerived, WithBase;
!function(OnlyDerived) {
    class Base {
    }
    new class extends Base {
    }(), new class extends Base {
    }();
}(OnlyDerived || (OnlyDerived = {})), function(WithBase) {
    class Base {
    }
    new Base(), new class extends Base {
    }();
}(WithBase || (WithBase = {}));
