
class Foo {
    async fnName1(
        @Arg('GraphQLArgName', { nullable: true }) argName: boolean,
    ): Promise<number> { }

    async fnName2(
        @Arg('GraphQLArgName', { nullable: true }) argName: boolean = false,
    ): Promise<number> { }
}