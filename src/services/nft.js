import request from '@/utils/request';
import { ethers } from 'ethers';
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
