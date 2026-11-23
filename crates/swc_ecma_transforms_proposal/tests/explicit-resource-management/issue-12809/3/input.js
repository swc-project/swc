const log = [];
using res = {
  [Symbol.dispose]() {
    console.log(log);
  },
};
export default log.push("default");
export const named = log.push("named");
