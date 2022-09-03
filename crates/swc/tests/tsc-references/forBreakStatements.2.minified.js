//// [forBreakStatements.ts]
FOUR: for(;;)FIVE: for(;;)break FOUR;
for(;;);
for(;;)for(;;);
EIGHT: for(;;){
    var fn = function() {};
    break EIGHT;
}
