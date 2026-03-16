function Component(props) {
  const env = useRelayEnvironment();

  const mutator = new Mutator(env);

  useOtherHook();

  const x = {};
  foo(x, mutator);
  return x;
}

class Mutator {}
