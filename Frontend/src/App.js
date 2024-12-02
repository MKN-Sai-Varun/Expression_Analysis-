import React, { useState } from 'react';
import Register from './Componenets/Register'; // Import the Register component
import LoginPlay from './Componenets/LoginPlay';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // Define initial page state

  return (
    <>
      {currentPage === 'login' && (
        <div id="app">
          <LoginPlay setCurrentPage={setCurrentPage} /> {/* Pass setCurrentPage to game1 */}
        </div>
      )}

      {currentPage === 'register' && (
        <div id="app">
          <Register setCurrentPage={setCurrentPage} /> {/* Pass setCurrentPage to Register */}
        </div>
      )}
    </>
  );
}

export default App;
