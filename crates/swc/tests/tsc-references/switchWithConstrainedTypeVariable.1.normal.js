//// [switchWithConstrainedTypeVariable.ts]
// Repro from #20840
function function1(key) {
    switch(key){
        case 'a':
            key.toLowerCase();
            break;
        default:
            key.toLowerCase();
            break;
    }
}
