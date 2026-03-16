function useFoo() {}

function Foo() {
  const name = useFoo.name;
  console.log(name);
  return name;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};
