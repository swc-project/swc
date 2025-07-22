import { useState } from "react";
import { getCondition, doSomething } from "./utils";
export default function useMeow() {
    const [state, setState] = useState("init");
    const onMeow = async ()=>{
        if ("init" === state) {
            const innerCondition = getCondition();
            switch(innerCondition){
                case "a":
                    break;
                case "b":
                    break;
                default:
                    await doSomething();
            }
        } else await doSomething();
    };
    return {
        onMeow
    };
}
