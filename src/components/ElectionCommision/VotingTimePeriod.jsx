import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"

const VotingTimePeriod = ()=>{
  const {web3State} = useWeb3Context()
  const {contractInstance} = web3State;
  
  const startRef = useRef(null);
  const endRef = useRef(null);
  const handleVotingTime=async(e)=>{
      try{
        e.preventDefault();
        // Convert date string to Unix timestamp (seconds)
      const startTime = Math.floor(new Date(startRef.current.value).getTime() / 1000);
      const endTime = Math.floor(new Date(endRef.current.value).getTime() / 1000);
      
        console.log("Start:", startTime, "End:", endTime);
        await contractInstance.setVotingPeriod(startTime,endTime)
        console.log("Voter Time is set successful")
      }catch(error){
        toast.error("Error: Voting Time Period")
        console.error(error)
      }
  }
  return(<>
    <form onSubmit={handleVotingTime}>
        <label>Start Time:
            <input type="date" className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
            ref={startRef}></input>
        </label>
        <label>End Time:
            <input type="date"
            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
            ref={endRef} ></input>
        </label>
        
        <button type="submit">Register</button>
    </form>
  </>)
}
export default VotingTimePeriod;