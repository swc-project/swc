var Values = function(Values) {
    Values[Values["A"] = 1] = "A";
    Values[Values["Postfix"] = Values.A++] = "Postfix";
    Values[Values["Prefix"] = ++Values.A] = "Prefix";
    Values[Values["TypedPrefix"] = ++Values.A] = "TypedPrefix";
    Values[Values["Assigned"] = Values.A = 7] = "Assigned";
    Values[Values["Deleted"] = +delete Values.A] = "Deleted";
    return Values;
}(Values || {});
var Iterated = function(Iterated) {
    Iterated[Iterated["A"] = 1] = "A";
    Iterated[Iterated["Last"] = (()=>{
        for (Iterated.A of [
            2,
            3
        ]){}
        return Reflect.get(Iterated, "A");
    })()] = "Last";
    return Iterated;
}(Iterated || {});
