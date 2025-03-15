import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "../../context/useWeb3Context";
import { uploadCandidateImage } from "../../utils/uploadCandidateImage";
import { toast } from "react-hot-toast";
import { CircleUserRound, Upload, Loader2 } from 'lucide-react';

const RegisterCandidate = () => {
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();
  const { web3State, handleWallet } = useWeb3Context();
  const { contractInstance, selectedAccount } = web3State;

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const nameRef = useRef(null);
  const genderRef = useRef(null);
  const partyRef = useRef(null);
  const ageRef = useRef(null);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCandidateRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const name = nameRef.current.value;
      const age = ageRef.current.value;
      const gender = genderRef.current.value;
      const party = partyRef.current.value;

      if (!contractInstance) throw new Error("Contract instance not found!");

      const imageUploadStatus = await uploadCandidateImage(file);
      if (imageUploadStatus) {
        await contractInstance.registerCandidate(name, party, age, gender);
        resetForm();
        toast.success("Candidate registered successfully!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      toast.error("Error registering candidate");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    nameRef.current.value = "";
    ageRef.current.value = "";
    genderRef.current.value = genderEnum.NotSpecified;
    partyRef.current.value = "";
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center mb-8 relative">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Candidate preview" 
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500"
              />
            ) : (
              <CircleUserRound className="w-24 h-24 text-purple-400" />
            )}
            <h1 className="text-3xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Candidate Registration
            </h1>
            <p className="text-gray-400 mt-2">Enter candidate details below</p>
          </div>
          
          <form onSubmit={handleCandidateRegistration} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Candidate Name
                </label>
                <input 
                  ref={nameRef}
                  type="text"
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input 
                  ref={ageRef}
                  type="number"
                  min="18"
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter age"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <select 
                  ref={genderRef}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select gender</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Other</option>
                  <option value="0">Not Specified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Political Party
                </label>
                <input 
                  ref={partyRef}
                  type="text"
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter party name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Candidate Photo
              </label>
              <input 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Register Candidate
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-sm mt-4">
          Connected Account: {selectedAccount ? 
            `${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}` : 
            'Not Connected'}
        </p>
      </div>
    </div>
  );
};

export default RegisterCandidate;