const app = { name: "app" };
const log: string[] = [];

using res = {
  [Symbol.dispose]() {
    log.push(`dispose ${Registry.items.join(",")}`);
    const result = JSON.stringify(log);
    console.log(result);
    if (result !== '["dispose x"]') {
      throw new Error(`unexpected log: ${result}`);
    }
  },
};

export default app;
export class Registry {
  static items: string[] = [];
}
Registry.items.push("x");
