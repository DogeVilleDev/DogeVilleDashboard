import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import DogeVilleToken from '../abis/DogeVille.json'
import DogeVilleLogo from '../DogeVilleLogo.png'
import DollarLogo from '../dollar.png'



class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    //this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  async testFunction(){
    await this.loadWeb3()
    await this.loadBlockchainData()
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


async loadBlockchainData() {
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0] })

  // Load smart contract
  const networkId = await web3.eth.net.getId()
  console.log(networkId);
  //const networkData = MemoryToken.networks[networkId]
  if(networkId === 56) {
    const abi = DogeVilleToken.abi
    const address = "0xd3b6bFd18b34AE0E3165738bf66eBC64Cad1B944"
    const token = new web3.eth.Contract(abi, address)
    this.setState({ token })
    console.log(token)
    const totalSupply = await token.methods.totalSupply().call()
    const totalFees = await token.methods.totalFees().call()
    var totalDividendsDistributed = await token.methods.getTotalDividendsDistributed().call()
    totalDividendsDistributed = web3.utils.fromWei(totalDividendsDistributed.toString(), "ether").toString()
    totalDividendsDistributed = parseFloat(totalDividendsDistributed).toFixed(2).toString()
    

    const accountDividendsInfo = await token.methods.getAccountDividendsInfo(accounts[0]).call()
    const adjustedDividends = accountDividendsInfo[4] - accountDividendsInfo[3]             // Function from contract return the current amount of dividends in wallet + the dividends it will receive in an hour.
    var accountTotalDividendsReceived = web3.utils.fromWei(adjustedDividends.toString(),"ether").toString()
    //accountTotalDividendsReceived = parseInt(accountTotalDividendsReceived, 10).toString()
    accountTotalDividendsReceived = parseFloat(accountTotalDividendsReceived).toFixed(2).toString()
  
    var accountNextPayout = web3.utils.fromWei(accountDividendsInfo[3].toString(),"ether").toString()
    accountNextPayout = parseFloat(accountNextPayout).toFixed(3).toString()
    console.log(accountNextPayout)
    const totalHolders = await token.methods.getNumberOfDividendTokenHolders().call()

    var balanceOf = await token.methods.balanceOf(accounts[0]).call()
    balanceOf = web3.utils.fromWei(balanceOf.toString(),"ether").toString()
    balanceOf = parseInt(balanceOf, 10).toString();

    this.setState({ totalSupply })
    this.setState({ totalFees })
    this.setState({ balanceOf })
    this.setState({totalHolders})
    this.setState({accountTotalDividendsReceived})
    this.setState({totalDividendsDistributed})
    this.setState({accountNextPayout})
    // Load Tokens
    //let balanceOf = await token.methods.balanceOf(accounts[0]).call()
  } else {
    alert('Smart contract not deployed to detected network.')
  }
}

  

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      totalFees: 0,
      totalDividendsDistributed:0,
      accountTotalDividendsReceived: 0,
      accountNextPayout:0 ,
      totalHolders:0,
      balanceOf: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: []
    }
  }

  
  render() {
    return (
      <div className="background" >
                 
      <div class="jumbotron d-flex align-items-center min-vh-100">
        <div class="container-fluid ">

        <div class="row py-2">
          <div class="col-sm">
          <figure class="text-center">
          <h1><strong></strong></h1>
          </figure>
          </div>

        <div class="col-sm">
        <figure class="text-center">
        </figure>  
        </div>
        <div class="col-sm">
        <figure class="text-center">
          <h1><strong></strong></h1>
          </figure>
          </div>
      </div>

          
          <div class="row py-5">
          <div class="col-sm bg-white shadow-lg rounded-pill ">
          <figure class="text-center">
          <img src={DogeVilleLogo} width="100" height="100" className="d-inline-block align-top" alt="" />
          <h4><span id="result">&nbsp;{this.state.totalHolders.toString()}</span></h4>
          <h3><strong>Token holders test</strong></h3>
          <h1> </h1>
          </figure>
          </div>

        <div class="col-sm">
        <figure class="text-center">
        </figure>  
        </div>
        <div class="col-sm bg-white shadow-lg rounded-pill">
          <figure class="text-center">
          <img src={DogeVilleLogo} width="100" height="100" className="d-inline-block align-top" alt="" />
          <h4><span id="result">&nbsp;{this.state.balanceOf.toString()}</span></h4>
          <h3><strong>Your token balance</strong></h3>
          <h1> </h1>
          </figure>
          </div>
      </div>

  <div class="row py-5">
  <div class="col-sm bg-white shadow-lg rounded-pill">
    <figure class="text-center">
    <img src={DollarLogo} width="100" height="100" className="d-inline-block align-top" alt="" />
      <h4><span id="result">&nbsp;{this.state.totalDividendsDistributed.toString()}</span></h4>
      <h3><strong>Total dividens distributed</strong></h3>
    </figure>
      </div>
    <div class="col-sm">
    <figure class="text-center">
      
    </figure>  
    </div>
    <div class="col-sm bg-white shadow-lg rounded-pill">
    <figure class="text-center">
    <img src={DollarLogo} width="100" height="100" className="d-inline-block align-top" alt="" />
      <h4><span id="result">&nbsp;{this.state.accountTotalDividendsReceived.toString()}</span></h4>
      <h3><strong>Your dividends received</strong></h3>
    </figure>
      </div>
  </div>

  <div class="row py-5">
  <div class="col-sm ">
    <figure class="text-center">

    </figure>
      </div>
    <div class="col-sm">
    <figure class="text-center">
      
    </figure>  
    </div>
    <div class="col-sm bg-white shadow-lg rounded-pill">
    <figure class="text-center">
    <img src={DollarLogo} width="100" height="100" className="d-inline-block align-top" alt="" />
      <h4><span id="result">&nbsp;{this.state.accountNextPayout.toString()}</span></h4>
      <h3><strong>Your next payout</strong></h3>
    </figure>
      </div>
  </div>

  
</div>
</div>



</div>
    );
  }

}

window.addEventListener('DOMContentLoaded', () => {
  const metaMaskLoginButton = document.getElementById('metaMaskLoginButton')
  const manualLoginButton = document.getElementById('manualLoginButton')
});

export default App;
