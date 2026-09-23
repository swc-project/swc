// @flow
const result = match (value) {
  | 'single' => 1,
  | 'first' | 'second' | 'third' => 2,
  | (| 'grouped' | 'nested') => 3,
  {kind: | 'start' | 'move'} => 4,
  [| 'left' | 'right', | 'tail'] => 5,
  | 'bound' | 'alias' as const kind if enabled: kind,
  | _ => 0,
};
