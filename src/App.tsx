import React from 'react';

function App() {
  return (
    <React.Suspense fallback={'Loading...'}>
      <div>Initial page</div>
    </React.Suspense>
  );
}

export default App;
