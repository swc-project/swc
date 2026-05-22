var window = {}, moment_utc = (input)=>({
        diff: ()=>0
    });
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
    f: (start, end)=>((inputStartDate, inputEndDate, spec = defaultSpec)=>{
            let startDate = moment_utc(inputStartDate), dayCount = moment_utc(inputEndDate).diff(startDate, "days") + 1, granularity = spec.granularities.sort((left, right)=>left.maxDays - right.maxDays).find((item)=>dayCount <= item.maxDays);
            return null == granularity ? "" : granularity.displayFormatString;
        })(start, end) + String(1)
}, console.log(window.x.f(0, 0));
