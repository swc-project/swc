import { useState } from "react";
import { getCondition, doSomething } from "./utils";

export default function useMeow() {
    const [state, setState] = useState("init");
    const onMeow = async () => {
        switch (state) {
            case "init": {
                const innerCondition = getCondition();
                switch (innerCondition) {
                    case "a":
                        break;
                    case "b":
                        break;
                    default:
                        await doSomething();
                }
                break;
            }
            default: {
                await doSomething();
                break;
            }
        }
    };
    return {
        onMeow,
    };
}
