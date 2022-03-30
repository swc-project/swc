for (var a of [
    1
]){
    switch(true){
        case true:
            {
                var b = 1;
                ()=>b
                ;
                if (true) break;
                continue;
            }
        case false:
            {
                throw new Error("unreachable");
            }
    }
}
