class o {
    bar() {
        for (const o of [
            6,
            5
        ]){
            for (let f of [
                4,
                3
            ]){
                for (var r of [
                    2,
                    1
                ]){
                    console.log(o, f, r);
                }
            }
        }
    }
}
new o().bar();
