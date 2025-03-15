import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"
export default function EmergencyDeclare() {
   const {web3State} = useWeb3Context()
   const {contractInstance} = web3State;

   const emergencyStop = async () => {
      try{
         await contractInstance.emergencyStopVoting()
      }catch(error){
         toast.error("Error: Emergency Stop")
         console.error(error)
      }
      
   }

   return <button onClick={emergencyStop}>Stop voting</button>
}