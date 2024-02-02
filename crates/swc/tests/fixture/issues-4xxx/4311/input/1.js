const printMemberName = (target: any, memberName: string) => {
    console.log(memberName);
};

class TestClass {


    // moving the decorator below the comment works as expected

    @printMemberName
    /**
     * some tsdoc comments
     * 
     * Some more comments
     * over
     * multiple
     * lines
     */
    async run(): Promise<boolean> {
        return await Promise.resolve(true);
    }
}

export { TestClass };
