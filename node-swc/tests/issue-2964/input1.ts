/* input 1 comment 1 */
const tail = <T extends Array<unknown>>([_, ...tail]: T) => tail;

// input 1 comment 2
export const saysHello = () => console.log("hello");