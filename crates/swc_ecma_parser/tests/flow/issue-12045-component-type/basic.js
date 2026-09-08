type ComponentType = component(ref?: mixed, ...props: mixed);
type FunctionType = (props: mixed) => mixed;
type HookType = hook (mixed) => mixed;

const MyComponent: component(ref?: mixed, ...props: mixed) = ({
  ref,
  ...rest
}) => null;
export const ExportedComponent: component(value: mixed) = value => value;
const OrdinaryArrow: (value: mixed) => mixed = value => value;
const HookArrow: hook (mixed) => mixed = value => value;
const UntypedArrow = value => value;
const ExistingFunction: component() = function() {
  return null;
};
