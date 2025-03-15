import { useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Users, AlertCircle } from 'lucide-react';

const GetVoterList = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [voterList, setVoterList] = useState([]);
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  useEffect(() => {
    const fetchVoterList = async () => {
      try {
        const voterList = await contractInstance.getVoterList();
        setVoterList(voterList);
      } catch (error) {
        toast.error("Error: Getting Voting List");
        console.error(error);
      }
    };
    contractInstance && fetchVoterList();
  }, [contractInstance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center mb-8">
            <Users className="w-16 h-16 text-purple-400 mb-4" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Voter List
            </h1>
            <p className="text-gray-400 mt-2">View all registered voters</p>
          </div>

          {voterList.length !== 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {voterList.map((voter, index) => (
                    <tr 
                      key={index}
                      className={`border-b border-gray-700/50 
                        ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'}
                        hover:bg-purple-900/20 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-300">
                        {`${voter.voterAddress.slice(0, 6)}...${voter.voterAddress.slice(-4)}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{voter.name}</td>
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                          <img
                            className="w-full h-full object-cover"
                            src={`http://localhost:3000/images/VoterImages/${voter.voterAddress}.jpg`}
                            alt={`${voter.name}'s photo`}
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
              <p className="text-xl font-semibold">No Voters Found!</p>
              <p className="mt-2">Register voters to see them listed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetVoterList;