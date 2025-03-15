import { useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import { Loader2,Users,AlertCircle } from 'lucide-react';
import "./GetCandidateList.css"

const GetCandidateList =  ()=>{
  const {web3State} = useWeb3Context()
  
  const {contractInstance} = web3State;
  const [candidateList,setCandidateList] = useState([])
  const token = localStorage.getItem("token")
  const navigateTo = useNavigate()
  
 
  useEffect(()=>{
    if(!token){
      navigateTo("/")
    }
  },[navigateTo,token])
  
  useEffect(()=>{
    const fetchCandidateList = async()=>{
      try{
        const candidateList = await contractInstance.getCandidateList();
        setCandidateList(candidateList)
      }catch(error){
        toast.error("Error: Getting Candidate List")
        console.error(error)
      }
    }
    contractInstance && fetchCandidateList()
  },[contractInstance])

  return ( <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
    <div className="max-w-6xl mx-auto">
      <div className="glass-card p-8 shadow-xl">
        <div className="flex flex-col items-center justify-center mb-8">
          <Users className="w-16 h-16 text-purple-400 mb-4" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Candidate List
          </h1>
          <p className="text-gray-400 mt-2">View all registered candidates</p>
        </div>

        {candidateList.length !== 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Party</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Votes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Photo</th>
                </tr>
              </thead>
              <tbody>
                {candidateList.map((candidate, index) => (
                  <tr 
                    key={index}
                    className={`
                      border-b border-gray-700/50 
                      ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'}
                      hover:bg-purple-900/20 transition-colors duration-150
                    `}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-300">
                      {`${candidate.candidateAddress.slice(0, 6)}...${candidate.candidateAddress.slice(-4)}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{candidate.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{candidate.party}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                        {String(candidate.votes)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                        <img
                          className="w-full h-full object-cover"
                          src={`http://localhost:3000/images/CandidateImages/${candidate.candidateAddress}.jpg`}
                          alt={`${candidate.name}'s photo`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/70?text=No+Image';
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <AlertCircle className="w-16 h-16 mb-4 text-gray-500" />
            <p className="text-xl font-semibold">No Candidates Found!</p>
            <p className="mt-2">Register candidates to see them listed here.</p>
          </div>
        )}
      </div>
    </div>
  </div>);
}
export default GetCandidateList;