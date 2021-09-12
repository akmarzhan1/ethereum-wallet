import React, { Component } from 'react';
import daiLogo from '../dai-logo.png';
import './App.css';
import Web3 from 'web3';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import DaiTokenMock from '../abis/DaiTokenMock.json'
import USDTokenMock from '../abis/USDTokenMock.json'
import MKRTokenMock from '../abis/USDTokenMock.json'


class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadETHData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadDAIData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const daiTokenAddress = "0xBE025A12091dE321C9788F722B1f2172a158DE47" // Replace DAI Address Here
    const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress)
    this.setState({ tokenMock: daiTokenMock })
    const balance = await daiTokenMock.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })
    const currency = 'DAI'
    this.setState({currency: currency})
    const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
    console.log(transactions)
  }

  async loadUSDTData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const USDTokenAddress = "0xEb2D16C2cf546A54336fD35f8bcd101110aa9EE6" // Replace DAI Address Here
    const usdTokenMock = new web3.eth.Contract(USDTokenMock.abi, USDTokenAddress)
    this.setState({ tokenMock: usdTokenMock })
    const balance = await usdTokenMock.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })
    const currency = 'USDT'
    this.setState({currency: currency})
    const transactions = await usdTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
    console.log(transactions)
  }

  async loadMKRData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const MKRTokenAddress = "0xA6a70C03fD3035d5305Bd7849da18bAeD493ba04" // Replace DAI Address Here
    const mkrTokenMock = new web3.eth.Contract(MKRTokenMock.abi, MKRTokenAddress)
    this.setState({ tokenMock: mkrTokenMock })
    const balance = await mkrTokenMock.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })
    const currency = 'MKR'
    this.setState({currency: currency})
    const transactions = await mkrTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
    console.log(transactions)
  }

  async loadETHData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const currency = 'ETH'

    this.setState({currency: currency})

    const balance = await web3.eth.getBalance(accounts[0]); //Will give value in.
    this.setState({ balance: Math.round(web3.utils.fromWei(balance.toString(), 'Ether')*100)/100})
    const transactions = []
    this.setState({ transactions: transactions })
    console.log(transactions)
  }

  transfer(recipient, amount) {
    if (this.state.currency === "ETH"){
      window.web3.eth.sendTransaction({from: this.state.account, to: recipient, value: amount})
    }
    else {
      this.state.tokenMock.methods.transfer(recipient, amount).send({ from: this.state.account })
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      tokenMock: null,
      balance: 0,
      currency: null,
      transactions: []
    }

    this.transfer = this.transfer.bind(this)
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            ٩(◕‿◕)۶
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={daiLogo} width="150" />
                </a>
                <h1>{this.state.balance} {this.state.currency}</h1>
                <DropdownButton id="dropdown-basic-button" title="Choose token">
                <Dropdown.Item onClick={async () => {await this.loadETHData();}}>ETH</Dropdown.Item>
                <Dropdown.Item onClick={async () => {await this.loadDAIData();}}>DAI</Dropdown.Item>
                <Dropdown.Item onClick={async () => {await this.loadUSDTData();}}>USDT</Dropdown.Item>
                <Dropdown.Item onClick={async () => {await this.loadMKRData();}}>MKR</Dropdown.Item>
                </DropdownButton>
                <hr></hr>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const recipient = this.recipient.value
                  const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                  this.transfer(recipient, amount)
                }}>

                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key} >
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                        </tr>
                      )
                    }) }
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;