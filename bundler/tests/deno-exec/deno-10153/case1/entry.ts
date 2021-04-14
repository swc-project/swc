import { validate, required, isNumber } from "https://deno.land/x/validasaur/mod.ts";

// WORKING IMPORT: Pull in each module individually from its full path
// import { validate } from "https://deno.land/x/validasaur@v0.15.0/src/validate.ts";
// import { required } from "https://deno.land/x/validasaur@v0.15.0/src/rules/required.ts";
// import { isNumber } from "https://deno.land/x/validasaur@v0.15.0/src/rules/is_number.ts";

const inputs = {
    name: "",
    age: "20"
};

const [passes, errors] = await validate(inputs, {
    name: required,
    age: [required, isNumber]
});

console.log({ passes, errors });