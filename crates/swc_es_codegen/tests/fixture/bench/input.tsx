type Props = {
  value: number;
  render(v: number): string;
};

function View(props: Props) {
  return <div className="root">{props.render(props.value)}</div>;
}

const node = <View value={1} render={(v) => `${v}`} />;
export { View, node };
