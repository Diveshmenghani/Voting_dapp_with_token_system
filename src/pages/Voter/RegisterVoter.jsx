import { useState, useRef, useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { useNavigate } from "react-router-dom";
import { uploadVoterImage } from "../../utils/uploadVoterImage";
import { toast } from "react-hot-toast";
import { CircleUserRound } from 'lucide-react';

const RegisterVoter = () => {
  const { web3State, handleWallet } = useWeb3Context();
  const { contractInstance, selectedAccount } = web3State;
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();

  const genderEnum = {
    NotSpecified: 0,
    Male: 1,
    Female: 2,
    Other: 3,
  };

  useEffect(() => {
    if (!token) navigateTo("/");
    if (!selectedAccount) handleWallet();
  }, [navigateTo, token, selectedAccount]);

  const handleVoterRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const name = nameRef.current.value;
      const age = ageRef.current.value;
      const gender = genderRef.current.value;

      if (!contractInstance) throw new Error("Contract instance not found!");

      const imageUploadStatus = await uploadVoterImage(file);
      if (imageUploadStatus) {
        await contractInstance.registerVoter(name, age, gender);
        resetForm();
        toast.success("Voter registered successfully!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      toast.error("Error registering voter");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    nameRef.current.value = "";
    ageRef.current.value = "";
    genderRef.current.value = genderEnum.NotSpecified;
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center mb-8 relative">
            <CircleUserRound className="w-24 h-24 text-purple-400" />
            <h1 className="text-3xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Voter Registration
            </h1>
            <p className="text-gray-400 mt-2">Enter voter details below</p>
          </div>

          <form onSubmit={handleVoterRegistration} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                ref={nameRef}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter voter name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age
              </label>
              <input
                type="number"
                ref={ageRef}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter age"
                required
                min="18"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                ref={genderRef}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value={genderEnum.NotSpecified}>Not Specified</option>
                <option value={genderEnum.Male}>Male</option>
                <option value={genderEnum.Female}>Female</option>
                <option value={genderEnum.Other}>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Voter Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                required
              />
              {file && (
                <span className="text-gray-400 text-sm mt-1">
                  {file.name}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? "Registering..." : "Register Voter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterVoter;
