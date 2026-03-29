declare export class URLSearchParams {
  @@iterator(): Iterator<[string, string]>;
}

type IgnorePattern = string;
interface ILogBox {
  ignoreLogs($ReadOnlyArray<IgnorePattern>): void;
}

type ReactDevToolsAgent = {};

type ReactDevToolsGlobalHook = {
  on: (eventName: string, (agent: ReactDevToolsAgent) => void) => void,
  off: (eventName: string, (agent: ReactDevToolsAgent) => void) => void,
};

type ReactFabricType = {foo: number};
type ReactNativeType = {bar: string};

type GetMethod = (<MethodName: $Keys<ReactFabricType>>(
  () => ReactFabricType,
  MethodName,
) => ReactFabricType[MethodName]) &
  (<MethodName: $Keys<ReactNativeType>>(
    () => ReactNativeType,
    MethodName,
  ) => ReactNativeType[MethodName]);

type AnimatedProps<Props: {...}> = Props;

type AnimatedComponentType<
  Props: {...},
  +Instance = unknown,
> = component(ref?: React.RefSetter<Instance>, ...AnimatedProps<Props>);

type GenericProps<T, S> = {
  t: T,
  s: S,
  ...
};

type SectionListType = component(
  ref?: React.RefSetter<any>,
  ...GenericProps<any, string>,
);

type ActivityType = component(
  ...{
    mode: 'visible' | 'hidden',
    children: React.Node,
  }
);
