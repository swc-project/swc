//// [exponentiationOperatorWithInvalidSimpleUnaryExpressionOperands.ts]
var temp;
import { _ as _type_of } from "@swc/helpers/_/_type_of";
--temp, temp--, temp++, temp--, --temp, temp--, temp++, temp--, _type_of(--temp), _type_of(temp--), _type_of(3), _type_of(temp++), _type_of(temp--), _type_of(--temp), _type_of(temp--), _type_of(3), _type_of(temp++), _type_of(temp--), delete --temp, delete ++temp, delete temp--, delete temp++, delete --temp, delete ++temp, delete temp--, delete temp++;
