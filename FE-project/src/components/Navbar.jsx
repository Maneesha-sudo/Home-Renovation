import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-green-600">
        RenovationTracker
      </Link>

      <div className="space-x-4">
        <Link to="/projects" className="hover:text-green-600">
          Projects
        </Link>
        <Link to="/dashboard" className="hover:text-green-600">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}