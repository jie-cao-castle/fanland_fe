import request from '@/utils/request';
import { configure } from 'enzyme';
import { ethers, utils } from 'ethers';
import {
    nftBytecode,
    nftAbi,
  } from '../assets/constants.json'

export async function deployContract(params) {
    console.log(params);
    // We must specify the network as 'any' for ethers to allow network changes
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    let nftFactory = new ethers.ContractFactory(
        nftAbi,
        nftBytecode,
        ethersProvider.getSigner(),
    );
    const contract = await nftFactory.deploy(
        params.name,
        'TST',
        1,
    );

    console.log(contract.address);    
    console.log(contract.deployTransaction.hash);
    return contract;
}

export async function queryChainId() {
    return ethereum.request({
        method: 'eth_chainId',
    });
}

export async function connectContract(params) {
    console.log(params);
    // We must specify the network as 'any' for ethers to allow network changes
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');

    // The address from the above deployment example
    let contractAddress = params.contractAddress;
    //let contractAddress = "0x147B8eb97fD247D06C4006D269c90C1908Fb5D54";
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let signer = ethersProvider.getSigner();
    let contract = new ethers.Contract(contractAddress, nftAbi, signer);
    return contract.deployed();
}


export async function setTokenPrice(params) {
    console.log(params);
    // We must specify the network as 'any' for ethers to allow network changes
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');

    // The address from the above deployment example
    let contractAddress = params.contractAddress;
    let price = params.price.toString();
    let tokenId = params.tokenId;
    //let contractAddress = "0x147B8eb97fD247D06C4006D269c90C1908Fb5D54";
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let signer = ethersProvider.getSigner();
    let contract = new ethers.Contract(contractAddress, nftAbi, signer);

    // Set a new Value, which returns the transaction
    let tx = await contract.allowBuy(tokenId, utils.parseEther(price));

    // See: https://ropsten.etherscan.io/tx/0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364
    console.log(tx.hash);
    return tx;
}


export async function buyNftwithPrice(params) {
    console.log(params);
    // We must specify the network as 'any' for ethers to allow network changes
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');

    // The address from the above deployment example
    let contractAddress = params.contractAddress;
    //let contractAddress = "0x147B8eb97fD247D06C4006D269c90C1908Fb5D54";
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let signer = ethersProvider.getSigner();
    let contract = new ethers.Contract(contractAddress, nftAbi, signer);

    // All overrides are optional
    let overrides = {
        // The amount to send with the transaction (i.e. msg.value)
        value: utils.parseEther(params.price),
    };

    // Set a new Value, which returns the transaction
    let tx = await contract.buy(params.tokenId, overrides);

    // See: https://ropsten.etherscan.io/tx/0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364
    console.log(tx.hash);
    return tx
}

export async function getTransaction(params) {
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    var transactionHash = params.transactionHash;

    let transaction = await ethersProvider.getTransaction(transactionHash);
    console.log(transaction)

    return transaction.wait();
}

export async function getETHtoUSDprice() {
    console.log("getETHtoUSDprice");
    return request('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
  }