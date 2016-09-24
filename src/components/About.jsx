import React, { Component } from 'react'

const urls = {
  d3: 'http://www.reactd3.org/docs/basic/',
  axios: 'https://github.com/mzabriskie/axios',
  bluebird: 'http://bluebirdjs.com/docs/getting-started.html',
  express: 'https://expressjs.com/en/4x/api.html',
  reactCreateApp: 'https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html',
  jsx: 'https://facebook.github.io/react/docs/jsx-in-depth.html',
  oocss: 'https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/',
  smacss: 'https://smacss.com/',
  es6: 'http://es6-features.org/',
  babelLoader: 'https://github.com/babel/babel-loader',
  nodejs: 'https://nodejs.org/en/',
  sass: 'http://sass-lang.com/guide',
  dom: 'https://www.w3.org/DOM/'
}

class About extends Component {
  render() {
    return (
      <article className="page">
        <header>
          <h2>About &bdquo;My Transactions&rdquo;</h2>
        </header>
        <div className="page-content with-columns">
          <div className="row">
            <div className="column small-12 medium-6 large-6">
              <h3>Application idea</h3>
              <p>This application was firstly built to parse HSBC statements and visualise balance over time, enhancing it with categorised summary of expenses.</p>
              <p>Apart from my curiosity parsing CSV files and visualising data, this full stack NodeJS+Express / ES6+React built application became my public code sample.</p>
              <p>Ideally this will be nice and functional application, covered with tests, containing rich set of features and implementing well known and popular libraries / frameworks.</p>
            </div>
            <div className="column small-12 medium-6 large-6">
              <h3>Technologies used</h3>
              <p>Starting from environment setup and ending up with final touch.</p>
              <ul>
                <li>React, written in <a href={urls.es6} target="_blank">ES6</a> (<a href={urls.babelLoader} target="_blank">transpiled</a> to JS)
                  <ul>
                    <li><a href={urls.d3} target="_blank">D3 basic</a> for data visualisation</li>
                    <li><a href={urls.axios} target="_blank">Axios</a> for HTTP requests</li>
                    <li><a href={urls.bluebird} target="_blank">Bluebird</a> promises implementation</li>
                  </ul>
                </li>
                <li>
                  <a href={urls.dom} target="_blank">DOM</a> written in <a href={urls.jsx} target="_blank">JSX</a>, visually enhanced using <a href={urls.sass} target="_blank">SCSS</a>, using <a href={urls.smacss} target="_blank">SMACSS</a> method with slight taste of <a href={urls.oocss} target="_blank">OOCSS</a>.
                </li>
                <li><a href={urls.nodejs} target="_blank">NodeJS</a> and <a href={urls.express} target="_blank">Express</a> framework</li>
                <li><a href={urls.reactCreateApp} target="_blank">react-create-app</a> was used to set up local development environment</li>
                <li>Other libraries: <em>moment, formidable.</em></li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="column small-12 medium-6 large-6">
              <h3>Thank you</h3>
              <p>Thank you for checking out my app.</p>
              <p>Sincerely,<br/><span className="gediminas">Gediminas</span></p>
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default About
