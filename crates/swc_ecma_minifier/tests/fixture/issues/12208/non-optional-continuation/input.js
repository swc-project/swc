for (const access of [
    () => ({ x: null })?.x.y,
    () => ({ x: null })?.x(),
]) {
    try {
        access();
    } catch (error) {
        console.log(error.name);
    }
}
