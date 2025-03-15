import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { toast } from "react-hot-toast";
import { Wallet } from 'lucide-react';

const TokenBalance = ({ erc20ContractInstance }) => {
  const { web3State } = useWeb3Context();
  const { selectedAccount } = web3State;
  const [userTokenBalance, setUserTokenBalance] = useState("0");

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        const tokenBalanceWei = await erc20ContractInstance.balanceOf(selectedAccount);
        const decimals = await erc20ContractInstance.decimals();
        const tokenBalance = ethers.formatUnits(tokenBalanceWei, decimals);
        console.log(tokenBalance);
        setUserTokenBalance(tokenBalance);
      } catch (error) {
        toast.error("Error: Getting Token Balance");
        console.error(error);
      }
    };
    if (erc20ContractInstance) {
      fetchTokenBalance();
    }
  }, [erc20ContractInstance, selectedAccount]);

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
  <div className="glass-card p-6">
    <div className="flex items-center justify-center gap-3 mb-4">
      <Wallet className="w-5 h-5 text-purple-400" />
      <h2 className="text-xl font-semibold ">Your Balance</h2>
    </div>
    <p className="text-2xl font-bold text-purple-300">
      {userTokenBalance} GLD
    </p>
  </div>
  </div>
);
};

export default TokenBalance;