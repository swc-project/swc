function getDescription(option, parentGroup) {
    return [
        parentGroup && parentGroup.label,
        option.__labelPrefix,
    ]
        .concat(option.tags)
}

function printDescription() {
  const option = {__labelPrefix: 'test', tags: []};
  const parent = null
  const desc = getDescription(option, parent);
  console.log(desc);
}

printDescription();