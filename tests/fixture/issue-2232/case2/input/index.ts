const resolver = {
    async sendSomeMessage(
        _parent: unknown,
        { input: { toNumber, messageBody, ...all } }: SendSomeMessageInput,
        { dataSources }: Context,
    ): Promise<boolean> { }
}

export default resolver
