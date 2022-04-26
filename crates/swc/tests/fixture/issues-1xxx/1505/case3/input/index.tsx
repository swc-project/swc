type InjectedTeamsProps = {};
class Component<_T, _U> {}
class ComponentType<_T> {}
const withTeamsForUser = <P extends InjectedTeamsProps>(
  _WrappedComponent: ComponentType<P>
) =>
  class extends Component<
    Omit<P, keyof InjectedTeamsProps> & Partial<InjectedTeamsProps>,
    InjectedTeamsProps
  > {
    static displayName = `x`;
  };
