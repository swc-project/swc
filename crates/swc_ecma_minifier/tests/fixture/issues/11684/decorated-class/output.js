@replace
class DecoratedDeclaration {
    constructor(value){
        this.value = value;
    }
}
out.DecoratedDeclaration = DecoratedDeclaration, out.decoratedDeclaration = new DecoratedDeclaration(1, 2, 3);
const DecoratedExpression = @replace
class {
    constructor(value){
        this.value = value;
    }
};
out.DecoratedExpression = DecoratedExpression, out.decoratedExpression = new DecoratedExpression(1, 2, 3);
