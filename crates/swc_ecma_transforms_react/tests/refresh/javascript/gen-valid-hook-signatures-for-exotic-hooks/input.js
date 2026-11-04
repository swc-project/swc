
    import FancyHook from 'fancy';
    export default function App() {
      function useFancyState() {
        const [foo, setFoo] = React.useState(0);
        useFancyEffect();
        return foo;
      }
      const bar = useFancyState();
      const baz = FancyHook.useThing();
      React.useState();
      useThePlatform();
      return <h1>{bar}{baz}</h1>;
    }
