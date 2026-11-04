
        class C {
            m() {
                for (let x = 0; x < 10; x++) console.log(this, y => y != x)
            }
        }
        