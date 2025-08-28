//// [es2022IntlAPIs.ts]
for (let zoneName of [
    'short',
    'long',
    'shortOffset',
    'longOffset',
    'shortGeneric',
    'longGeneric'
])new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: zoneName
});
for (let key of [
    'calendar',
    'collation',
    'currency',
    'numberingSystem',
    'timeZone',
    'unit'
])Intl.supportedValuesOf(key);
