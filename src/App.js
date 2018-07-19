import React, { Component } from 'react';
import decode from 'hi-base32'
import * as speakeasy from 'speakeasy'
import QRCode from 'qrcode'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secret_tmp: JSON.parse(localStorage.getItem('2fa_tmp')) || {},
      token: ''
    }
    this.gerarQrCode = this.gerarQrCode.bind(this)
    this.verificaToken = this.verificaToken.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {    
    if ( !localStorage.getItem('2fa_tmp') ) {
      var secret = speakeasy.generateSecret();
      localStorage.setItem( '2fa_tmp', JSON.stringify(secret) )
    }

    this.setState({
      secret_tmp: JSON.parse(localStorage.getItem('2fa_tmp'))
    })
  }

  secret() {
    return this.state.secret_tmp.base32
  }

  gerarQrCode () {
    let url;

    QRCode.toDataURL(`otpauth://totp/SecretKey?secret=${this.secret()}`, function(err, data_url) {
      url = data_url;
    })

    return url;
  }

  verificaToken (token) {
    var verified = speakeasy.totp.verify({
      secret: decode.decode(this.secret()),
      encoding: 'ascii',
      token: token
    })
    return verified
  }

  handleChange (event) {
    this.setState({
      token: event.target.value
    })
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
          <h3 style={{ color: '#17B935' }}>{`Token: ${this.secret()}`}</h3>
          <p> Capture o código QR no app de autenticação </p>
          <label htmlFor="token">Insira o código: </label>
          <input type='text' id='token' value={this.state.token} onChange={this.handleChange} />          
          {
            this.verificaToken(this.state.token) ? 
              <h2>Sucesso, código válido!</h2> :
              <h2>Código inválido, obtenha um novo</h2>
          }
        </div>
      </div>
    );
  }
}

export default App;
