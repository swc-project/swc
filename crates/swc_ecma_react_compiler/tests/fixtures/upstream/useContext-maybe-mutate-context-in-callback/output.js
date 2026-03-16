import { c as _c } from "react/compiler-runtime";
import * as React from "react";
import { useContext } from "react";
import { mutate } from "shared-runtime";

const FooContext = React.createContext({ current: null });

function Component(props) {
  const $ = _c(5);
  const Foo = useContext(FooContext);
  let t0;
  if ($[0] !== Foo.current) {
    t0 = () => {
      mutate(Foo.current);
    };
    $[0] = Foo.current;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const onClick = t0;
  let t1;
  if ($[2] !== onClick || $[3] !== props.children) {
    t1 = <div onClick={onClick}>{props.children}</div>;
    $[2] = onClick;
    $[3] = props.children;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ children: <div>Hello</div> }],
};
