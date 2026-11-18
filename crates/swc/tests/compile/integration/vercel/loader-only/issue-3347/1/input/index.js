const myFunction = () => {
    for (let j = 0; j <= 3; j++) {
        for (const _ of []) {
        }

        if (j === 1) {
            console.log("before set timeout, j is:", j);

            setTimeout(() => {
                console.log("in timeout: j is", j);
            }, 50);
        }
    }

    return null;
};

myFunction();
