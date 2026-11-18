import { current, clear } from "data:text/javascript,export let current={name:'before'};export function clear(){current=null}";

export function setup() {
    const instance = current;
    return () => instance.name;
}

const render = setup();
clear();
console.log(render());
