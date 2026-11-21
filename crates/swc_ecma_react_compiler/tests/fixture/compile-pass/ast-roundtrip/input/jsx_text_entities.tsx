function withNbsp(label) {
  return (
    <span>
      {label}
      &nbsp;
    </span>
  );
}

function withSpace(label) {
  return (
    <span>
      {label}
      &#32;
    </span>
  );
}

export function Header({ label }) {
  return (
    <div>
      {withNbsp(label)}
      {withSpace(label)}
      <p>
        {label}
        &nbsp;&amp;&#x41;&copy;&lt;&#123;
      </p>
      <b>&nbsp;A&#32;B&nbsp;</b>
    </div>
  );
}

function withArrow(label) {
  return <q>{label} -> next&nbsp;</q>;
}

function withLoneSurrogate(label) {
  return (
    <span>
      {label}
      &#xD800;&nbsp;
      &#32;
    </span>
  );
}

export function Trimmed({ label }) {
  return (
    <span>
      {label}
      &#32;
    </span>
  );
}
