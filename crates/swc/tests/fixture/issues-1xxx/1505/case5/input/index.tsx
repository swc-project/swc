const withTeamsForUser = <P extends InjectedTeamsProps>() =>
  class extends Component<
    Omit<P, keyof InjectedTeamsProps> & Partial<InjectedTeamsProps>
  > {
    static displayName = `x`;
  };
