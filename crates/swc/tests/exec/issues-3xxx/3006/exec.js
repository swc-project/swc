async function a() {
    for (const number_in_a_sequence of Array.from(new Array(7), (_, i) => i)) {
        setTimeout(() => console.log(number_in_a_sequence), 10);
    }
}
a();
