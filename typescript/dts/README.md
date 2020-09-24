# swc_ts_dts

`.d.ts` generator for the swc project.

## Testing

If you have a large typescript file, split it into parts so you can fix the only require part easily.
If a file is large, the amount of log will overwhelm you. (I'm sure)

Also, if you are testing inference, make variables top level so that `tsc` and `swc_ts_dts` emits the type of the variable.
But sometimes it's not possible, because of a generic parameter.
In this case, you can specify generic in a top-level function and **return** the value. If you need to check multiple value, copy it into multiple files, and return each value at once. Alternatively, you can return an object literal.
Select the strategy based on the debuggability. (Ammunt of log messages, etc...)

When you split a file named `test-1.ts`, name it like `test-1-1.ts` or `test-1-2.ts`.
If you need to split once again, just append hypen and the number.

For example,

- `test-1.ts`
- `test-1-1.ts`
- `test-1-1-1.ts`
- `test-1-1-1-1.ts`
- `test-1-1-2.ts`
- `test-1-2-1.ts`

this makes `test-1.ts` integration test for `test-1-*.ts`.

## License

Copyright @kdy1, all rights reserved.

License: Mit / Apache 2.0 at your option
