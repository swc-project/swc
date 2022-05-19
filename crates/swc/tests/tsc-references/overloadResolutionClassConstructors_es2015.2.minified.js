class fn1 {
    constructor(){}
}
new fn1(void 0), new fn1({});
class fn2 {
    constructor(){}
}
new fn2(0, void 0), new fn2(0, ''), new fn2('', 0), new fn2('', 0);
class fn3 {
    constructor(){}
}
new fn3(3), new fn3('', 3, ''), new fn3(5, 5, 5), new fn3(4), new fn3('', '', ''), new fn3('', '', 3), new fn3();
class fn4 {
    constructor(){}
}
new fn4('', 3), new fn4(3, ''), new fn4('', 3), new fn4(3, ''), new fn4('', 3), new fn4(3, ''), new fn4(3, void 0), new fn4('', null), new fn4(null, null), new fn4(!0, null), new fn4(null, !0);
class fn5 {
    constructor(){
        return;
    }
}
new fn5((n)=>n.toFixed()), new fn5((n)=>n.substr(0)), new fn5((n)=>n.blah);
