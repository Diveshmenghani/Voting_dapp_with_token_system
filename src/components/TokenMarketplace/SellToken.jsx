import { ethers } from "ethers";
import { useRef,useState } from "react";
import {toast} from "react-hot-toast"
import {ShieldCheck,ArrowUpDown} from "lucide-react";
const SellToken = ({contractInstance,erc20ContractInstance}) => {
    const sellTokenAmountRef = useRef()
    const approveTokenAmountRef = useRef()
     const [isLoading, setIsLoading] = useState(false);
    const sellToken = async(e)=>{
      try{
       e.preventDefault()
       const tokenValueEth = sellTokenAmountRef.current.value;
       const tokenValueWei = ethers.parseEther(tokenValueEth,18);
       const tx = await contractInstance.sellGLDToken(tokenValueWei)
       const reciept = tx.wait()
       console.log("Transaction Successful")
      }catch(error){
        toast.error("Error: Selling Token")
        console.error(error)
      }
    }
    const approveToken = async(e)=>{
      try{
        e.preventDefault()
        const tokenValueEth = approveTokenAmountRef.current.value;
        const tokenValueWei = ethers.parseEther(tokenValueEth,18);
        const tokenMarketPlace = "0x3e492dd46004fba4f8f8a69fa25154a2bcaf787f"
        const tx = await erc20ContractInstance.approve(tokenMarketPlace,tokenValueWei)
        const reciept = tx.wait()
        console.log("Transaction Successful")
      }catch(error){
        console.error(error)
      }
     }
    return ( <>
     <form onSubmit={sellToken} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <ArrowUpDown className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Sell Tokens</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    VOTE Amount
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    ref={sellTokenAmountRef}
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
                      Sell Tokens
                    </>
                  )}
                </button>
              </div>
            </form>
    {/* <form onSubmit={sellToken}>
      <label>Token Amount To Sell(In Eth):</label>
      <input type="text" ref={sellTokenAmountRef}></input>
      <button type="submit">Sell Token</button>
    </form>
    <form onSubmit={approveToken}>
      <label>Token Amount To Approve(In Eth):</label>
      <input type="text" ref={approveTokenAmountRef}></input>
      <button type="submit">Approve Token</button>
    </form> */}
    </>);
}
 
export default SellToken;