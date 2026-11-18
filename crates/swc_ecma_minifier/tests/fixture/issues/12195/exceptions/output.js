try {
    console.log("A".toLowerCase("x" in null));
} catch (error) {
    console.log(error.name);
}
