import { useRef,useEffect,useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";  
import { Vote, AlertCircle, Loader2 } from 'lucide-react';
import VotingStatus from "../ElectionCommision/VotingStatus";

const CastVote = ()=>{
  const {web3State,handleWallet} = useWeb3Context()
  const {contractInstance,selectedAccount} = web3State;
  const voterIdRef = useRef(null);
  const candidateIdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");
 

 useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
    if (!selectedAccount) {
      handleWallet(); 
    }
  }, [navigateTo, token, selectedAccount]);
  const voteCandidate=async(e)=>{
    e.preventDefault();
    setIsLoading(true);
      try{
        const voterId = voterIdRef.current.value;
        const candidateId = candidateIdRef.current.value;
        if (!voterId || !candidateId) {
          toast.error("Please fill in all fields");
          return;
        }
        await contractInstance.castVote(voterId,candidateId)
        toast.success("Vote cast successfully!");
      }catch(error){
        toast.error("Error: Casting Vote")
        console.error(error)
      }
      finally {
        setIsLoading(false);
      }
  }
  return(<>
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <VotingStatus />
        
        <div className="glass-card p-8 shadow-xl mt-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <Vote className="w-16 h-16 text-purple-400 mb-4" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Cast Your Vote
            </h1>
            <p className="text-gray-400 mt-2">Enter your details to vote for a candidate</p>
          </div>

          <form onSubmit={voteCandidate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Voter ID
              </label>
              <input
                type="text"
                ref={voterIdRef}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your voter ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Candidate ID
              </label>
              <input
                type="text"
                ref={candidateIdRef}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter candidate ID"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
              
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Casting Vote...
                </>
              ) : (
                <>
                  <Vote className="w-5 h-5" />
                  Cast Vote
                </>
              )}
            </button>
          </form>

          {selectedAccount && (
            <div className="mt-6 text-center text-sm text-gray-400">
              Connected Wallet: {`${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`}
            </div>
          )}
        </div>
      </div>
    </div>
  </>)
}
export default CastVote;