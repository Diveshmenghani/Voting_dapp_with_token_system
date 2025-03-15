import { ethers } from "ethers";
import abi from "../constant/abi.json";
import axios from "axios";
import Web3Modal from "web3modal";
import { toast } from "react-hot-toast";

export const getWeb3State = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Metamask is not installed");
    }

    // Get the current chain ID
    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });
    const chainId = parseInt(chainIdHex, 16);

    // Use Web3Modal to connect to the wallet
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);

    // Request accounts
    const accounts = await provider.send("eth_requestAccounts", []);
    const selectedAccount = accounts[0];

    // Get network and signer details
    const network = await provider.getNetwork();
    const signer = await provider.getSigner();

    // Create the contract instance
    //old address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    const contractAddress = "0xEaa883f1844e4b20347f8F0F61F4e1162BD122C5";
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);

    // Get token and stored account from localStorage
    let token = localStorage.getItem("token");
    const storedAccount = localStorage.getItem("selectedAccount");

    // If token doesn't exist or the stored account doesn't match the current account,
    // then force a new signature to get a token.
    if (!token || storedAccount !== selectedAccount) {
      const message = "Welcome to Voting Dapp. You accept our terms and condition";
      const signature = await signer.signMessage(message);
      const res = await axios.post(
        `http://localhost:3000/api/authentication?accountAddress=${selectedAccount}`,
        { signature }
      );
      token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("selectedAccount", selectedAccount);
    }

    return { contractInstance, selectedAccount, chainId, signer, provider, network };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to initialize Web3 state");
  }
};
