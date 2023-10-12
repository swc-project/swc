let message = 0;
for (let x of [1, 2, 3, 4, 5]) {
    for (let y of ["a", "b", "c", "d"]) {
        console.log("Message", ++message, x, y);
        [].forEach(() => {});
        break;
    }
}
console.log("WHY", message == 5);
