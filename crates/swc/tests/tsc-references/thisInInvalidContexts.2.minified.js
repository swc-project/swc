//// [thisInInvalidContexts.ts]
var M, SomeEnum;
M || (M = {}), function(SomeEnum) {
    SomeEnum[SomeEnum.A = this] = "A", SomeEnum[SomeEnum.B = this.spaaaace] = "B";
}(SomeEnum || (SomeEnum = {}));
