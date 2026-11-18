console.log(String.fromCharCode(65), Object.keys({ global: true }).join(","));

{
    const String = {
        fromCharCode() {
            return "local String";
        },
    };
    const Object = {
        keys() {
            return ["local Object"];
        },
    };

    console.log(
        String.fromCharCode(65),
        Object.keys({ local: true }).join(",")
    );
}
