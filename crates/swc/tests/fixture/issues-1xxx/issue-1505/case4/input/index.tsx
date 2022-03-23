export const a = class extends Component<
  Omit<P, keyof InjectedTeamsProps> & Partial<InjectedTeamsProps>
> {};
