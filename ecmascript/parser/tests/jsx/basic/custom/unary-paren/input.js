import React from 'react';

function App() {
  const isLoading = true;
  return (
    <div>
      <h1>works </h1>
      {
        isLoading ? (
          <div>loading </div>
        ) : (
            <div>naaaaaaaaaaaaffffffffffffffff </div>
          )
      }
    </div>
  );
}

export default App;