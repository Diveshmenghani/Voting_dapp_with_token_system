import React, { useState,useEffect } from 'react'
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"
const DisplayResult = () => {
        
    const {web3State} = useWeb3Context()
    const {contractInstance} = web3State;
    const [winner, setWinner] = useState("No winner declared")
   
    useEffect(()=>{
        const getWinner = async()=>{
          try{
            const winningCandidateAddress = await contractInstance.winner();
            if(winningCandidateAddress!='0x0000000000000000000000000000000000000000'){
              setWinner(winningCandidateAddress)
            }
  
          }catch(error){
            toast.error("Error: Getting Winner")
            console.error(error)
          }
        }
        contractInstance && getWinner()
      },[])
  return (
    <div>
      <h3>Winner: {winner}</h3>
    </div>
  )
}

export default DisplayResult