import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <h1>Counter App</h1>
      <p>I'm at {counter}</p>
      <div>
        <button onClick={() => setCounter(counter => counter + 1)}>Increment</button>
        <button onClick={() => setCounter(counter => counter - 1)}>Decrement</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.body.appendChild(document.createElement('div')));

