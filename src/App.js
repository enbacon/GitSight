import React from 'react';
import './App.css';
import Repos from './Components/Repos'
import Users from './Components/Users'

export default function App() {
  return (
    <div className="App">
      <Repos />
      <Users />
    </div>
  );
}
