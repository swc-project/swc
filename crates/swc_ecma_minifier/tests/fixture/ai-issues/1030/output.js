try {
    "foo".includes(/t/);
} catch (e) {
    console.log(e.constructor.name);
}
