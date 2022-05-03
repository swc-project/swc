const Test = (name: string): any => {
    return (target: any, key: string) => {
        // stuff
    };
}

@Test(FormulaRuleEntity.NAME)
class FormulaRuleEntity {

    static readonly NAME = 'cat';

}