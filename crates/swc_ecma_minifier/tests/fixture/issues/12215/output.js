console.log("A", "global"), console.log(({
    fromCharCode: ()=>"local String"
}).fromCharCode(65), ({
    keys: ()=>[
            "local Object"
        ]
}).keys({
    local: !0
}).join(","));
