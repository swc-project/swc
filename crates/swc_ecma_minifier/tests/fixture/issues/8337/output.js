function allowInAnd(callback) {
    var flags = this.prodParam.currentFlags();
    var prodParamToSet = ParamKind.PARAM_IN & ~flags;
    if (prodParamToSet) {
        this.prodParam.enter(flags | ParamKind.PARAM_IN);
        try {
            return callback();
        } finally{
            this.prodParam.exit();
        }
    }
    return callback();
}
"module evaluation";
export { allowInAnd };
