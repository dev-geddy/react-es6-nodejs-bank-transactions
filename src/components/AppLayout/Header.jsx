import React, {Component} from 'react'
import {Link} from 'react-router'

class Header extends Component {
  render() {
    const {activeLocation} = this.props
    return (
      <header id="appHeader">
        <div className="logo">
          <i className="material-icons">account_balance_wallet</i>
          <div className="great-title">
            <strong>My Transactions</strong>
            <small>React/ES6/Express/NodeJS</small>
          </div>
        </div>
        <nav className="header-navigation dark header-column">
          <Link to="/" className={activeLocation === '/' ? 'current' : 'home'}>Upload</Link>
          <Link to="/summary" activeClassName="current">Summary</Link>
          <Link to="/about" activeClassName="current">About</Link>
        </nav>
      </header>
    )
  }
}

export default Header
