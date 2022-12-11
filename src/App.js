// import logo from './logo.svg';
import './App.css';

import { ethers } from 'ethers';
import React, {useState} from 'react';
// import contractABI from './abi.json';
import contractABIstaking from './abi_staking.json';

// This function detects most providers injected at window.ethereum
// import detectEthereumProvider from '@metamask/detect-provider';

// const contractAdress = '0x0ea7396Fc14e60a98EE1e020A67EEf3907Ada8Ac';
const contractAdressStaking = '0x1D37813CB62DD4Bf6CD065e582AA9cC87AD1f135';

let provider = new ethers.providers.Web3Provider(window.ethereum);
let contract = new ethers.Contract(contractAdressStaking, contractABIstaking, provider);
let signer;


// const loadData = async() => {
//   // const provider = new ethers.providers.Web3Provider(window.ethereum)
//   const provider = new ethers.providers.Web3Provider(window.ethereum)
//   const contract = new ethers.Contract(contractAdress, contractABI, provider)
//   const greeting = await contract.hello()
//   alert(greeting);
// }

// const metamask_test = async() => {

//   const provider = new ethers.providers.Web3Provider(window.ethereum)

//   await provider.send("eth_requestAccounts", []);

//   const signer = provider.getSigner()

//   if (provider) {
//     // From now on, this should always be true:
//     alert(provider.isMetaMask);
//     // alert('MetaMask found');
//   } else {
//     alert('Please install MetaMask!');
//   }
// }

function App() {
  const [donated,setDonated] = useState(0);
  const [lidoBalance,setLidoBalance] = useState(0);
  const [surplus,setSurplus] = useState(0);

  const connect = async() => {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAdressStaking, contractABIstaking, signer);
    const userAdress = await signer.getAddress();
    console.log(userAdress);
    await updateBalances();
  }
  
  const deposit = async() => {
    let userAmount = document.getElementById('deposit-amount').value;
    const weiAmount = ethers.utils.parseEther(userAmount);
    console.log(await contract.deployed())
    const tx = await contract.deposit({value: weiAmount});
    const receipt = await tx.wait();
    await updateBalances();
  }
  
  const withdraw = async() => {
    await contract.withdraw();
    await updateBalances();
  }
  
  const updateBalances = async() => {
    const donated = await contract.donated();
    setDonated(ethers.utils.formatEther(donated));
    const lidoBalance = await contract.lidoBalance();
    setLidoBalance(ethers.utils.formatEther(lidoBalance));
    const surplus = lidoBalance.sub(donated);
    setSurplus(ethers.utils.formatEther(surplus));
  }

  setTimeout(() => {
    updateBalances();
  },
  2000);

  return (
    <div className="App">
      <header className="App-header">
        <h1><span className='blue'>App</span> to stake</h1>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          App to stake and withdraw earnings.
        </p>
        {/* <button onClick={loadData}>Click me</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <div className='App-body'>
          <div className='App-balances'>
            Donated: {donated} ETH<br />
            Balance: {lidoBalance} ETH<br />
            Surplus: {surplus} ETH<br />
          </div>
          <div className='App-button-box'>
            <button onClick={connect}>Connect Wallet</button>
          </div>
          <div className='App-button-box'>
          <input type="text" id="deposit-amount" placeholder='ETH' /> <br />
            <button onClick={deposit}>Deposit</button>
          </div>
          <div className='App-button-box'>
            <button onClick={withdraw}>Withdraw</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
