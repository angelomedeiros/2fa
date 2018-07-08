import React, { Component } from 'react';
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

  gerarQrCode () {
    let url;

    QRCode.toDataURL(this.state.secret_tmp.otpauth_url, function(err, data_url) {
      url = data_url;
    })

    return url;
  }

  verificaToken (token) {
    var verified = speakeasy.totp.verify({
      secret: this.state.secret_tmp.ascii,
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
          <p> Capture o código QR no app de autenticação </p>
          <label htmlFor="token">Insira o código: </label>
          <input type='text' id='token' value={this.state.token} onChange={this.handleChange} />
          <h3>{
            this.verificaToken(this.state.token) ? 'Sucesso, código válido!' : 'Código inválido, obtenha um novo!'
          }</h3>
        </div>
      </div>
    );
  }
}

export default App;
