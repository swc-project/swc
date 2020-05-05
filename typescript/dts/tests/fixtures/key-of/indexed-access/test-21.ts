// Repro from #13073

type KeyTypes = "a" | "b"
let MyThingy: { [key in KeyTypes]: string[] };

function addToMyThingy<S extends KeyTypes>(key: S) {
    MyThingy[key].push("a");
}
