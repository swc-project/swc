/* @flow */

type Args = ReadonlyArray<string>;
type Task<T> = T;
type ExecaPromise = mixed;
type Config = {};

export const tasks = (
  config: Config,
): ({
  assemble: (...gradleArgs: Args) => {
    run: Task<ExecaPromise>,
  },
}) => ({
  assemble: (...gradleArgs: Args) => ({run: 1}),
});
