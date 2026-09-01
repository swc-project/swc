function decorator() {}

const { classValue = @decorator class {} } = {};
const { memberValue = class { @decorator method() {} } } = {};
