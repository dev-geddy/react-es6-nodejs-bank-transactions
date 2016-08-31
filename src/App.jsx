import React, {Component} from 'react'
import './assets/scss/app.scss'

import Header from './components/AppLayout/Header'
import Footer from './components/AppLayout/Footer'

class App extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <Header activeLocation={this.props.location.pathname}/>
        <div className="app-content">{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}

export default App
