let arr = [];
for(let i = 0; i < 10; ++i){
    arr.push(class C {
        constructor(){
            this.prop = i;
        }
    });
}
