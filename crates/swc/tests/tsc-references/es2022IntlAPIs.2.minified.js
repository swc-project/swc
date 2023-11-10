//// [es2022IntlAPIs.ts]
for (const zoneName of [
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
for (const key of [
    'calendar',
    'collation',
    'currency',
    'numberingSystem',
    'timeZone',
    'unit'
])Intl.supportedValuesOf(key);
