import React from 'react';
import GithubLoginComponent from './components/auth/GithubLoginComponent';
import NavbarComponent from './components/layouts/NavbarComponent';
import RepositoriesListComponent from './components/github/RepositoriesListComponent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <div className="App">
      <NavbarComponent />

      <div className="content">
        {!isLoggedIn && <GithubLoginComponent onValidate={() => setIsLoggedIn(true)} />}
        {isLoggedIn && <RepositoriesListComponent />}
      </div>
    </div>
  );
}

export default App;
