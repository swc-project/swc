console.log("A", "global"), console.log("local String", ({
    keys: ()=>[
            "local Object"
        ]
}).keys({
    local: !0
}).join(","));
