// Unnamed function-type parameter followed by additional parameters
type Fn = (() => A, b: B) => C;

// React Native-style pattern
type AnimatedPropsMemoHook = (
  () => AnimatedProps,
  props: Readonly<{[string]: unknown}>,
) => AnimatedProps;

// Unnamed function-type parameter as only param (should already work)
type Fn2 = (() => A) => C;
