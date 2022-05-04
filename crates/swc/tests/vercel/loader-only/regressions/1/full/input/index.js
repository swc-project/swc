import { useEffect } from "react";

class Test {
    constructor(name) {
        this.name = name;
    }

    print = async (arg) => {
        console.log(this.name, arg);
    };
}

export default function Parent() {
    useEffect(() => {
        new Test("name").print("test");
    }, []);
    return <></>;
}
