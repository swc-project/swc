function f() {
    var id = "";
    for (id in { break: "me" }) console.log(id);
}
