export { };
(obj?.method)!();
new (obj?.Ctor)!();
(obj?.value)!.field;
(obj?.value)![key];
(obj?.tag)!`text`;
obj?.method!();
obj?.value!.field;
obj?.value!?.field;
(obj?.value)!?.field;
(obj?.method!)();
new (obj?.Ctor!)();
(obj?.value!).field;
obj?.value!?.field;
(obj?.method)!!();
(obj?.method!!)();
obj?.method!!();
(obj?.method)!()?.field;
(obj?.method)()?.field;
(obj?.method)!()?.();
(obj?.method)()?.();
(obj?.value).field?.method();
(obj?.value)!.field?.method();
obj?.[(other?.value).field];
obj?.[(other?.value)!.field];
obj?.method((other?.value).field);
obj?.method((other?.value)!.field);
obj?.method((other?.value).field)?.();
obj?.method((other?.value)!.field)?.();
(function() {
    return (other?.value).field;
})?.();
(function() {
    return (other?.value)!.field;
})?.();
[
    (other?.value).field
]?.();
({
    value: (other?.value).field
})?.();
