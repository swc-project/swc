
    import {useFancyState} from './hooks';
    import useFoo from './foo'
    export default function App() {
      const bar = useFancyState();
      const foo = useFoo()
      return <h1>{bar}</h1>;
    }
