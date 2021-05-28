function f() {
    var id = "";
    for (var id in { break: "me" }) console.log(id);
    console.log(id);
}
