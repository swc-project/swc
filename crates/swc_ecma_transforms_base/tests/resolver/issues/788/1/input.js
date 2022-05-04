window.addEventListener("message", (e) => {
    try {
        console.log(e.data);
    } catch (e) {
        console.log(e);
    }
});
