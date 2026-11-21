function withNbsp(label) {
  return (
    <span>
      {label}
      &nbsp;
    </span>
  )
}

function withSpace(label) {
  return (
    <span>
      {label}
      &#32;
    </span>
  )
}

export function Header({label}) {
  return (
    <div>
      {withNbsp(label)}
      {withSpace(label)}
    </div>
  )
}
