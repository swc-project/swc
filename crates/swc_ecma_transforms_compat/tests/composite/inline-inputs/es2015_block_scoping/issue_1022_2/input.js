
        for (let i = 0; i < 5; i++) {
            console.log(i++, [2].every(x => x != i))
            if (i % 2 === 0) continue
        }
        