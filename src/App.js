import React, { Component } from 'react';
import * as speakeasy from 'speakeasy'
import QRCode from 'qrcode'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secret_tmp: JSON.parse(localStorage.getItem('2fa_tmp')) || ''
    }
    this.gerarQrCode = this.gerarQrCode.bind(this)
    this.verificaToken = this.verificaToken.bind(this)
  }

  componentWillount() {    
    if ( localStorage.getItem('2fa_tmp') ) {
      var secret = speakeasy.generateSecret();
      localStorage.setItem( '2fa_tmp', JSON.stringify(secret) )      
    }

    this.setState({
      secret_tmp: JSON.parse(localStorage.getItem('2fa_tmp'))
    })
  }

  gerarQrCode () {
    let url;

    QRCode.toDataURL(this.state.secret_tmp.otpauth_url, function(err, data_url) {
      url = data_url;
    })

    return url;
  }

  verificaToken (token) {
    console.log(this.state.secret_tmp)
    var verified = speakeasy.totp.verify({
      secret: this.state.secret_tmp.base32,
      encoding: 'base32',
      token: token
    })

    return verified
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <h2>Testando o 2fa com o speakeasy</h2>
          <img src={`${this.gerarQrCode()}`} />
          <h3>{console.log(this.verificaToken())}</h3>
        </div>
      </div>
    );
  }
}

export default App;
