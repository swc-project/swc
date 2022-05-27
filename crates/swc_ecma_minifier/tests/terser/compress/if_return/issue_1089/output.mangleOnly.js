function a() {
    var a = document.getElementById("fname");
    if (a.files[0].size > 12345) {
        alert("alert");
        a.focus();
        return false;
    }
}
