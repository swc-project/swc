import { useState } from "react";
import { getCondition, doSomething } from "./utils";
export default function useMeow() {
    let [state, setState] = useState("init");
    return {
        onMeow: async ()=>{
            if ("init" === state) switch(getCondition()){
                case "a":
                case "b":
                    break;
                default:
                    await doSomething();
            }
            else await doSomething();
        }
    };
}
