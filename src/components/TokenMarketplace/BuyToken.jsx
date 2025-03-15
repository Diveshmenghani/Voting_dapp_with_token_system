import { ethers } from "ethers";
import { useRef,useState } from "react";
import { toast } from "react-hot-toast";
import {ShieldCheck,ArrowUpDown} from "lucide-react";

const BuyToken = ({ contractInstance }) => {
  const tokenAmountRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const buyToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Get the user input, e.g. "10"
      const tokenValue = tokenAmountRef.current.value;
      
      // Use 18 decimals for standard ERC20 tokens
      const tokenDecimals = 18;
      const tokenValueUnits = ethers.parseUnits(tokenValue, tokenDecimals); // token amount in smallest units

      // Get the token price from the contract (in wei)
      const tokenPrice = await contractInstance.tokenPrice();
      
      // Calculate the required ETH value: requiredValue = tokenValueUnits * tokenPrice / 1e18
      const divisor = 10n ** 18n; 
      const requiredValue = (tokenValueUnits * tokenPrice) / divisor;

      console.log("Token amount (units):", tokenValueUnits.toString());
      console.log("Token price (wei):", tokenPrice.toString());
      console.log("Required value (wei):", requiredValue.toString());

      // Call the buy function with the correct msg.value
      const tx = await contractInstance.buyGLDToken(tokenValueUnits, {
        value: requiredValue,
        gasLimit: 300000,
      });
      await tx.wait();
      toast.success("Tokens purchased successfully!");
    } catch (error) {
      toast.error("Error: Buy Token");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={buyToken} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <ArrowUpDown className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Buy Tokens</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ETH Amount
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    ref={tokenAmountRef}
                    className="w-full px-4 py-2 bg-gray-800/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="0.0"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                 disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Buy Tokens
                    </>
                  )}
                </button>
              </div>
            </form>
    // <form onSubmit={buyToken}>
    //   <label>Token Amount To Buy (In Tokens):</label>
    //   <input type="text" ref={tokenAmountRef} />
    //   <button type="submit">Buy Token</button>
    // </form>
  );
};

export default BuyToken;
