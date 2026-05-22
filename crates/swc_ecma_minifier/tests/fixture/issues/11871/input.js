var window = {};
var foo = { min: (items) => items[0] };
var bar = {};
var bucketFactory = () => ({
    utc: (input) => ({
        diff: () => 0
    })
});
var min = foo;
var moment = bucketFactory(bar);
const defaultSpec = {
    granularities: [
        {
            maxDays: 1,
            displayFormatString: "[Q]Q"
        }
    ],
    other: 1
};

window.x = {
    f: (start, end) => ((inputStartDate, inputEndDate, spec = defaultSpec) => {
        let startDate = moment.utc(inputStartDate);
        let dayCount = moment.utc(inputEndDate).diff(startDate, "days") + 1;
        let granularity = spec.granularities
            .sort((left, right) => left.maxDays - right.maxDays)
            .find((item) => dayCount <= item.maxDays);
        return granularity == null ? "" : granularity.displayFormatString;
    })(start, end) + String(min.min([1, 2]))
};

console.log(window.x.f(0, 0));
