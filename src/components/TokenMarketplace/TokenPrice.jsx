import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {toast} from "react-hot-toast"
import {TrendingUp} from "lucide-react"
const TokenPrice = ({contractInstance}) => {
   const [tokenPrice,setTokenPrice]=useState(null)
    useEffect(()=>{
     try{
         const fetchTokenPrice = async()=>{
            const tokenPriceWei = await contractInstance.tokenPrice();
            const tokenPriceEth = ethers.formatEther(tokenPriceWei)
            console.log(tokenPriceWei)
            setTokenPrice(tokenPriceEth)
         }
         contractInstance && fetchTokenPrice()
         
        }catch(error){
            toast.error("Error: Fetching Token Price")
            console.error(error)
        }
        
    },[contractInstance])
    return ( <>
    <div className="glass-card p-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Current Price</h2>
        </div>
        <p className="text-2xl font-bold items-center text-purple-300">
          {tokenPrice} ETH
        </p>
      </div>
   </> );
}
 
export default TokenPrice;