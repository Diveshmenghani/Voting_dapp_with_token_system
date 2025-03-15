import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnnounceWinner from "../../components/ElectionCommision/AnnounceWinner";
import DisplayResult from "../../components/ElectionCommision/DisplayResult";
import EmergencyDeclare from "../../components/ElectionCommision/EmergencyDeclare";
import VotingStatus from "../../components/ElectionCommision/VotingStatus";
import VotingTimePeriod from "../../components/ElectionCommision/VotingTimePeriod";
import { toast } from "react-hot-toast";

const ElectionCommision = () => {
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8 shadow-xl space-y-6">
          <VotingStatus />
          <DisplayResult />
          <VotingTimePeriod />
          <AnnounceWinner />
          <EmergencyDeclare />
        </div>
      </div>
    </div>
  );
};

export default ElectionCommision;
