var input = {};
var _key = prefix + 'state', _key1 = `${prefix}consents`, givenName = input.given_name, lastName = input['last_name'], country = input[`country`], state = input[_key], consents = input[_key1], rest = _object_without_properties(input, [
    "given_name",
    'last_name',
    `country`,
    _key,
    _key1
].map(_to_property_key));
