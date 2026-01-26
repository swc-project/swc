export class A extends B {
  public async getFrame(ms) {
    const result = await new Promise((resolve) => {
      lvSchedulerCallback(
        async () => {
          const frame = await super.getFrame(ms);
          resolve(frame);
        },
      );
    });
    return result;
  }
}
