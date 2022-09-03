//// [es2022IntlAPIs.ts]
const timezoneNames = [
    'short',
    'long',
    'shortOffset',
    'longOffset',
    'shortGeneric',
    'longGeneric'
];
for (const zoneName of timezoneNames)var formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: zoneName
});
