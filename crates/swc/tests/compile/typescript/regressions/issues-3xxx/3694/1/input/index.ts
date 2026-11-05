interface IConnectedAppProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

class Foo implements IConnectedAppProps {}
