type InjectedTeamsProps = {};
class Component<_T, _U> {}
class ComponentType<_T> {}
const withTeamsForUser = <P extends InjectedTeamsProps>(
  _WrappedComponent: ComponentType<P>
) =>
  class extends Component<Omit<P, keyof A> & Partial<B>, C> {
    static displayName = `x`;
  };
