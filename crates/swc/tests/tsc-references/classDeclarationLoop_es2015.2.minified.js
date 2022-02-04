const arr = [];
for(let i = 0; i < 10; ++i){
    class C {
        constructor(){
            this.prop = i;
        }
    }
    arr.push(C);
}
