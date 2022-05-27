class a {
    bar() {
        for (const a of [
            6,
            5
        ]){
            for (let b of [
                4,
                3
            ]){
                for (var c of [
                    2,
                    1
                ]){
                    console.log(a, b, c);
                }
            }
        }
    }
}
new a().bar();
