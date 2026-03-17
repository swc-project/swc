function MyApp(props) {
  if (props.cond) {
    return;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
