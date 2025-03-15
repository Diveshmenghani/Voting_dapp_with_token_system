import {useEffect, useState} from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"
export default function AnnounceWinner() {
   const {web3State} = useWeb3Context()
   const {contractInstance} = web3State;
   const getWinner = async () => {
      try{
         const tx = await contractInstance.announceVotingResult()
         const receipt = await tx.wait();
      }catch(error){
         toast.error("Error: Announcing result")
         console.error(error)
      }
        
    }
 
   return <div>
      <button onClick={getWinner}> Announce Winner </button>
   </div>
}