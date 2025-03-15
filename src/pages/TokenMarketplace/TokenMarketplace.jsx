import { useWeb3Context } from "../../context/useWeb3Context";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import BuyToken from "../../components/TokenMarketplace/BuyToken";
import SellToken from "../../components/TokenMarketplace/SellToken";
import TokenBalance from "../../components/TokenMarketplace/TokenBalance";
import TokenPrice from "../../components/TokenMarketplace/TokenPrice";
import tokenMarketplaceAbi from "../../constant/tokenMarketplaceAbi.json";
import erc20abi from "../../constant/erc20Abi.json";
import { Coins } from "lucide-react";
import { toast } from "react-hot-toast";

const TokenMarketplace = () => {
  const [tokenMarketplaceInstance, setTokenMarketplaceInstance] = useState(null);
  const [erc20ContractInstance, setErc20ContractInstance] = useState(null);

  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");
  const { web3State, handleWallet } = useWeb3Context();
  const { signer, provider, selectedAccount } = web3State;

  useEffect(() => {
    if (!token) navigateTo("/");
    if (!selectedAccount) handleWallet();
  }, [navigateTo, token, selectedAccount]);

  useEffect(() => {
    const erc20TokenInit = () => {
      try {
        const contractAddress = "0xf3D516E7e2eA7D4014558C415Fd60F29ABC2e1c7";
        const erc20ContractInstance = new ethers.Contract(contractAddress, erc20abi, provider);
        setErc20ContractInstance(erc20ContractInstance);
      } catch (error) {
        toast.error("Error start the vote");
      }
    };
    provider && erc20TokenInit();
  }, [provider]);

  useEffect(() => {
    const tokenMarketplaceInit = () => {
      try {
        const tokenMarketplaceContractAddress = "0x6B4B21674056eeE2e40c70B7E3e4864DA47b19D9";
        const tokenMarketplaceInstance = new ethers.Contract(tokenMarketplaceContractAddress, tokenMarketplaceAbi, signer);
        setTokenMarketplaceInstance(tokenMarketplaceInstance);
      } catch (error) {
        toast.error("Error: Token Marketplace");
        console.error(error);
      }
    };
    signer && tokenMarketplaceInit();
  }, [signer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8 shadow-xl space-y-6">
        <div className="flex flex-col items-center justify-center mb-8">
            <Coins className="w-16 h-16 text-purple-400 mb-4" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Token Marketplace
            </h1>
            <p className="text-gray-400 mt-2">Buy and sell governance tokens</p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <TokenBalance erc20ContractInstance={erc20ContractInstance} />
          <TokenPrice contractInstance={tokenMarketplaceInstance} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BuyToken contractInstance={tokenMarketplaceInstance} />
          <SellToken
            erc20ContractInstance={erc20ContractInstance}
            contractInstance={tokenMarketplaceInstance}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMarketplace;
