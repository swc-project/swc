let outer__2 = 0;
function normal__2(param__3 = outer__2) {
    var outer__3 = 1;
    let bodyOnly__3 = param__3;
    {
        let bodyOnly__4 = outer__3;
        use(bodyOnly__4);
    }
    use(outer__3, bodyOnly__3);
}
const arrow__2 = (param__5 = outer__2)=>{
    var outer__5 = 2;
    let bodyOnly__5 = param__5;
    {
        let bodyOnly__6 = outer__5;
        use(bodyOnly__6);
    }
    return [
        outer__5,
        bodyOnly__5
    ];
};
class Example__2 {
    constructor(param__7 = outer__2){
        var outer__7 = 3;
        let bodyOnly__7 = param__7;
        {
            let bodyOnly__8 = outer__7;
            use(bodyOnly__8);
        }
        use(outer__7, bodyOnly__7);
    }
}
