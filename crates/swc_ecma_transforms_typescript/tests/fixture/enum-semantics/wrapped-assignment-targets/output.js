var WrappedTargets = function(WrappedTargets) {
    WrappedTargets[WrappedTargets["A"] = 1] = "A";
    WrappedTargets[WrappedTargets["Grouped"] = WrappedTargets.A = 3] = "Grouped";
    WrappedTargets[WrappedTargets["Typed"] = WrappedTargets.A = 5] = "Typed";
    WrappedTargets[WrappedTargets["Compound"] = WrappedTargets.A += 2] = "Compound";
    WrappedTargets[WrappedTargets["Destructured"] = (()=>{
        [WrappedTargets.A] = [
            11
        ];
        ({ value: WrappedTargets.A } = {
            value: 13
        });
        return Reflect.get(WrappedTargets, "A");
    })()] = "Destructured";
    return WrappedTargets;
}(WrappedTargets || {});
var ReceiverReads = function(ReceiverReads) {
    ReceiverReads[ReceiverReads["Index"] = 0] = "Index";
    ReceiverReads[ReceiverReads["Result"] = (()=>{
        const values = [
            {
                value: 1
            }
        ];
        values[0].value = 8;
        values[0].value += 2;
        return values[0].value;
    })()] = "Result";
    return ReceiverReads;
}(ReceiverReads || {});
