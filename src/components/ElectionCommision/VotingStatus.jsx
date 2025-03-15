import React, { useState, useEffect } from 'react';
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"

const VotingStatus = () => {
    const { web3State } = useWeb3Context();
    const { contractInstance } = web3State;
    const [votingStatus, setVotingStatus] = useState("");

    // Enum mapping: Numeric values to string labels
    const statusMap = {
        0: "Not Started",
        1: "In Progress",
        2: "Ended"
    };

    useEffect(() => {
        const getVotingStatus = async () => {
            try {
                const currentVotingStatus = await contractInstance.getVotingStatus();
                console.log(currentVotingStatus);
                // Map the numeric status to a meaningful label
                setVotingStatus(statusMap[currentVotingStatus] || "Unknown Status");
            } catch (error) {
                toast.error("EError: Getting Voting Status")
                console.error(error);
                setVotingStatus("Error fetching status");
            }
        };

        if (contractInstance) {
            getVotingStatus();
        }
    }, [contractInstance]);

    return (
        <div>
            <h3>Status: {votingStatus}</h3>
        </div>
    );
};

export default VotingStatus;
