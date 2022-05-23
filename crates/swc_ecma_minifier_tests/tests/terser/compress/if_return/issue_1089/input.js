function x() {
    var f = document.getElementById("fname");
    if (f.files[0].size > 12345) {
        alert("alert");
        f.focus();
        return false;
    }
}
