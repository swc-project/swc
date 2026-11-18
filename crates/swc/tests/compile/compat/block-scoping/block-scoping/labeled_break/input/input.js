
    a:
    b:
    for (let i = 0; i < 2; i++) {
        if (i === 0) continue a
        if (i === 1) break b

        [1].forEach((_) => {
          console.log(i)
        })
    }
    