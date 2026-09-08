var key;
const object = {
    get [key = "value"] () {
        return key;
    },
    set [key] (value = key){
        console.log(value);
    }
};
console.log(object.value), object.value = void 0;
