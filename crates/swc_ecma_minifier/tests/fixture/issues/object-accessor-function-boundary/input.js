function make(key) {
    return {
        get [key]() {
            return key;
        },
        set [key](value = key) {
            console.log(value);
        },
    };
}

const object = make("value");
console.log(object.value);
object.value = undefined;
