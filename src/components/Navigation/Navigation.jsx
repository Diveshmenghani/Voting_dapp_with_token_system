import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Home, UserPlus, Users, Vote, Building2, Coins, ClipboardList, UserSquare2 } from 'lucide-react';

function Navigation() {
  return (
    <header className=" max-w-10xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 border-b border-white/10">
      <nav className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          
            <NavLink to="/" icon={<Home className="w-4 h-8" />}>
              Home
            </NavLink>
            <NavLink to="/register-voter" icon={<UserPlus className="w-4 h-4" />}>
              Register Voter
            </NavLink>
            <NavLink to="/register-candidate" icon={<UserSquare2 className="w-4 h-4" />}>
              Register Candidate
            </NavLink>
            <NavLink to="/voter-list" icon={<ClipboardList className="w-4 h-4" />}>
              Voter List
            </NavLink>
            <NavLink to="/candidate-list" icon={<Users className="w-4 h-4" />}>
              Candidate List
            </NavLink>
            <NavLink to="/cast-vote" icon={<Vote className="w-4 h-4" />}>
              Vote
            </NavLink>
            <NavLink to="/election-commision" icon={<Building2 className="w-4 h-4" />}>
              Election Commission
            </NavLink>
            <NavLink to="/token-marketplace" icon={<Coins className="w-4 h-4" />}>
              Token Marketplace
            </NavLink>
          </div>
       
      </nav>
    </header>
  );
}

// Custom NavLink component for consistent styling
function NavLink({ to, children, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-purple-800 hover:text-white transition-all duration-200 whitespace-nowrap"
    >
      <span className="mr-2">{icon}</span>
      {children}
    </Link>
  );
}

export default Navigation;