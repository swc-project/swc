export function Colors(member) {
    return Colors.ValueFor(member);
}
(function(Colors) {
    Colors.ValueMap = {
        Red: {
            value: 0,
            label: "Red"
        },
        Blue: {
            value: 1,
            label: "Blue"
        },
        Green: {
            value: 2,
            label: "Green"
        }
    };
    Colors.Values = [
        0,
        1,
        2
    ];
    function ValueFor(member) {
        return ValueMap[member]?.value;
    }
    Colors.ValueFor = ValueFor;
    async function LabelFor(member) {
        return ValueMap[member]?.label;
    }
    Colors.LabelFor = LabelFor;
})(Colors || (Colors = {
}));
