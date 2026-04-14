type Fn = (() => A, b: B) => C;

type AnimatedProps = {};

type AnimatedPropsMemoHook = (
  () => AnimatedProps,
  props: Readonly<{[string]: unknown}>,
) => AnimatedProps;
