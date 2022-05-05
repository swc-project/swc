window.addEventListener("message", function (e) {
    try {
        console.log(e.data);
    } catch (e) {
        console.log(e);
    }
});
