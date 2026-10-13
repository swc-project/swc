export {};

declare let value: number;
declare const other: number;
declare const object: { value: number };

++(<number>value);
--(<number>value);
(<number>value)++;
(<number>value)--;
++(<number><unknown>value);
--(<number>(value as unknown));
(<number><unknown>value)++;
(<number>(value as unknown))--;
++(<number>object.value);
(<number>object.value)++;
(++(<number>value)) + other;
((<number>value)++) < other;

++(value as number);
(value as number)++;
++value;
value++;
<number>++value;
<number>value++;
<number><unknown>value;
