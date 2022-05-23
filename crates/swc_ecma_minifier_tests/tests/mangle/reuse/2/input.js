function invalid(rule, params = {}, implicit = false) {
    return {
        rule,
        params,
        implicit,
    };
}
function nullable(value) {
    if (typeof value === "undefined") {
        return invalid(
            "nullable",
            {
                value,
            },
            true
        );
    }
}
function isNullable(rules) {
    return rules.find((rule) => rule === nullable) ? true : false;
}
function isOptionalValue(value) {
    return value === undefined || value === null || value === "";
}
function required(value) {
    return isOptionalValue(value)
        ? invalid(
              "required",
              {
                  value,
              },
              true
          )
        : undefined;
}
function isOptional(rules) {
    return rules.find((rule) => rule === required) ? false : true;
}
const resolveErrorMessage = (msg, params, attr, checkType) => {
    params.attr = attr;
    if (typeof msg === "function") {
        return msg(params, checkType || "");
    } else {
        for (let key in params) {
            msg = msg.replace(`:${key}`, params[key]);
        }
        return msg;
    }
};
const getCheckType = (rule) => {
    const split = rule.split(":");
    split.shift();
    return split.join(":");
};
const findBestMessage = (messages, key, ruleName, ruleKey, defaultMessage) => {
    return (
        messages[`${key}.${ruleName}`] ||
        messages[`${key}.${ruleKey}`] ||
        messages[key] ||
        messages[ruleName] ||
        messages[ruleKey] ||
        defaultMessage
    );
};
const resolveErrorMessages = (rawErrors, { messages, attributes }) => {
    const errorMessages = {};
    const defaultMessage = (messages || {})["default"] || ":attr is invalid";
    for (let key in rawErrors) {
        const errs = rawErrors[key];
        const attr = (attributes || {})[key] || key;
        errorMessages[key] = {};
        for (let err of errs) {
            const checkType = getCheckType(err.rule);
            const ruleKey = checkType
                ? err.rule.substr(0, err.rule.length - checkType.length - 1)
                : err.rule;
            if (err.rule === "validateObject" && err.params.errors) {
                errorMessages[key][ruleKey] = resolveErrorMessages(
                    err.params.errors,
                    {
                        messages,
                        attributes,
                    }
                );
            } else if (err.rule === "validateArray" && err.params.errors) {
                errorMessages[key][ruleKey] = resolveErrorMessages(
                    err.params.errors,
                    {
                        messages,
                        attributes,
                    }
                );
            } else {
                const msg = findBestMessage(
                    messages || {},
                    key,
                    err.rule,
                    ruleKey,
                    defaultMessage
                );
                errorMessages[key][ruleKey] = resolveErrorMessage(
                    msg,
                    err.params,
                    attr,
                    checkType
                );
            }
        }
    }
    return errorMessages;
};
const isStringInt = (value) => {
    return value.match(/^\d+$/) ? true : false;
};
const getValue = (input, key) => {
    if (typeof input[key] !== "undefined") {
        return input[key];
    }
    const paths = key.split(".");
    const value = paths.reduce(
        (data, path) => {
            if (data && typeof data === "object") {
                return data[path];
            } else if (data instanceof Array && isStringInt(path)) {
                const index = parseInt(path);
                return data[index];
            }
        },
        {
            ...input,
        }
    );
    return value;
};
const hasValue = (input, key) => {
    const value = getValue(input, key);
    return typeof value !== "undefined";
};
const makeValidationUtils = (input) => {
    return {
        getValue: (key) => getValue(input, key),
        hasValue: (key) => hasValue(input, key),
    };
};
const defaultMessages = {
    "fileExists:pathCheck": "file :value doesn't exists",
    "fileExists:stringCheck": "file path must be a string",
    isArray: ":attr must be an array",
    isBool: ":attr must be a boolean",
    isEmail: ":attr is not a valid email address",
    isFloat: ":attr must be a float number",
    isIn: ":value is not allowed",
    isInt: ":attr must be an integer",
    isNumber: ":attr must be a number",
    isNumeric: ":attr must be numeric",
    isString: ":attr must be a string",
    lengthBetween:
        ":attr characters length must be between :minLength-:maxLength",
    match: ":attr format is incorrect",
    maxLength: ":attr cannot be higher than :maxValue characters",
    maxNumber: ":attr cannot be higher than :maxValue",
    minLength: ":attr cannot be lower than :minValue characters",
    minNumber: ":attr cannot be lower than :minValue",
    notIn: ":value is not allowed",
    notNull: ":value cannot be null",
    numberBetween: ":value must be between :minValue - :maxValue",
    required: ":attr is required",
    default: ":attr is invalid",
};
const getValue1 = (input, key) => {
    return input[key];
};
const optionallyRequired = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule",
]);
const validateValue = async (value, rules, utils) => {
    const results = [];
    if (isOptionalValue(value) && isOptional(rules)) {
        const optionallyRequiredRules = rules.filter((r) =>
            optionallyRequired.has(r.name)
        );
        if (optionallyRequiredRules.length === 0) {
            return [];
        }
        for (let rule of rules.filter((r) => optionallyRequired.has(r.name))) {
            let res = rule(value, utils);
            if (res instanceof Promise) {
                res = await res;
            }
            if (res !== undefined && res.noContext) {
                return [];
            }
            if (res !== undefined) {
                results.push(res);
                if (res.implicit) {
                    return results;
                }
            }
        }
        rules = rules.filter((r) => !optionallyRequired.has(r.name));
    }
    if (typeof value === "object" && value === null && isNullable(rules)) {
        return [];
    }
    for (let rule of rules) {
        let res = rule(value, utils);
        if (res instanceof Promise) {
            res = await res;
        }
        if (res !== undefined && !res.noContext) {
            results.push(res);
            if (res.implicit === true) {
                break;
            }
        }
    }
    return results;
};
const validateData = async (input, rules) => {
    const results = {};
    const utils = makeValidationUtils(input);
    for (let key in rules) {
        const keyRules =
            rules[key] instanceof Array ? rules[key] : [rules[key]];
        const value = getValue1(input, key);
        const errors = await validateValue(value, keyRules, utils);
        if (errors.length) {
            results[key] = errors;
        }
    }
    return results;
};
const validate = async (
    input,
    rules,
    options = {
        messages: defaultMessages,
    }
) => {
    const rawErrors = await validateData(input, rules);
    const passes = Object.keys(rawErrors).length === 0;
    const errors = passes ? {} : resolveErrorMessages(rawErrors, options);
    return [passes, errors];
};
function isNumber(value) {
    if (typeof value !== "number") {
        return invalid("isNumber", {
            value,
        });
    }
}
const inputs = {
    name: "",
    age: "20",
};
const [passes1, errors1] = await validate(inputs, {
    name: required,
    age: [required, isNumber],
});
console.log({
    passes: passes1,
    errors: errors1,
});
