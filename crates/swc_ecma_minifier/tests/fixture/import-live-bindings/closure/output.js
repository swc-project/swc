import { current, clear } from "data:text/javascript,export let current={name:'before'};export function clear(){current=null}";
export function setup() {
    let instance = current;
    return ()=>instance.name;
}
let render = setup();
clear(), console.log(render());
