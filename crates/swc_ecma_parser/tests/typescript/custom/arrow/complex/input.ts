export function getTsConfigPropArrayElementValue(tsConfigSourceFile: TsConfigSourceFile | undefined, propKey: string, elementValue: string): StringLiteral | undefined {
    return firstDefined(getTsConfigPropArray(tsConfigSourceFile, propKey), property =>
        isArrayLiteralExpression(property.initializer) ?
            find(property.initializer.elements, (element): element is StringLiteral => isStringLiteral(element) && element.text === elementValue) :
            undefined);
}