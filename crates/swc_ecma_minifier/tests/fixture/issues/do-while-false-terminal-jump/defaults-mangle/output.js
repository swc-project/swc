function stateMachine() {
    for(var e = 0, s = [];;)switch(e){
        case 0:
            do {
                s.push("start");
                break;
            }while (!1)
            s.push("after first"), e = 1;
            continue;
        case 1:
            do {
                s.push("resume");
                continue;
            }while (!1)
            s.push("after second"), e = 2;
            continue;
        case 2:
            return s.push("complete"), s.join("|");
    }
}
console.log(stateMachine());
