import { useHook } from 'x';

// `x` is shadowed in `f`, so lowering renames the outer `x` to `x_0`. The
// memoized `x.foo(items)` and `x + items` temporaries get the location of an
// expression that starts at a reference to `x`; they must keep their own names.
export function C({ items }) {
  const f = () => {
    const x = 1;
    return x;
  };
  const x = useHook();
  const y = x.foo(items);
  return (
    <div onClick={f}>
      {y}
      {x + items}
      {x.bar}
    </div>
  );
}
