import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//importing the pages 
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

//import the components
import Header from './components/Header';
import Footer from './components/Footer';

//creates the http link 
const httpLink = createHttpLink({
  uri: '/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

//builds the app bringing together the pages and components
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <div className='container'>
            <Routes>
              <Route
                path="/"
                element={<Home />}
                />
              <Route 
                path="/login"
                element={<Login />}
              />
              <Route
                path="/signup"
                element={<Signup />}
              />
              <Route
                path="/profile/:username"
                element={<Profile />}
              />
              <Route
                path="/thought/:id"
                element={<SingleThought />}
              />
              <Route
                path="*"
                element={<NoMatch />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
