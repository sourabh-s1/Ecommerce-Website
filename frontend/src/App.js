import './App.css';
import Header from './components/layouts/Header/Header';
import {BrowserRouter as Router} from 'react-router-dom'
import {useEffect} from 'react';
import WebFont from 'webfontloader'

function App() {
  useEffect(() => {

    WebFont.load({
      google:{
        families:['Roboto','Droid Sans','Chilanka']
      }
    })
  },[])

  return (
    <Router>
      <Header/>
    </Router>
  )
}

export default App;
