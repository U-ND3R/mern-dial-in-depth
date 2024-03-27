import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector(state => state.user);
  const location = useLocation();
  const [buttonClicked, setButtonClicked] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setButtonClicked(true);
    navigate("/sign-in");
  };

  useEffect(() => {
    setButtonClicked(false);
  }, [location.pathname]);

  return (
    <header className="bg-slate-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="link-effect">
          <h1 className="flex flex-wrap items-center font-bold text-sm sm:text-hidden text-center">
            <img className="mr-2" src="../DID-logo.svg" alt="DID Logo" width={50} />
            <span className="text-indigo-800">Dial-</span>
            <span className="text-indigo-700">In-</span>
            <span className="text-indigo-600">Depth</span>
          </h1>
        </Link>
        <form action="" className="flex items-center bg-slate-100 p-3 rounded-lg border-solid border-2 border-indigo-600">
          <input type="text" name="search" id="search" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className="flex items-center gap-5">
          <Link to="/" className="link-effect">
            <li className="hidden sm:inline text-indigo-700">Home</li>
          </Link>
          <Link to="/about" className="link-effect">
            <li className="hidden sm:inline text-indigo-700">About</li>
          </Link>
          <li>
            {currentUser ? (
              <div className="flex items-center">
                <Link to="/profile" className="link-effect"><span className="text-indigo-700">{ currentUser.rest.username }</span></Link>
                <Link className="ml-4 link-effect danger"><GoSignOut className="text-red-500" /></Link>
              </div>
            ) :
            buttonClicked || location.pathname === "/sign-in" ? (
              <button className="button-disabled" disabled>Sign In</button>
            ) :
            buttonClicked || location.pathname === "/sign-up" ? (
              <button className="button-disabled" disabled>Sign Up</button>
            ) : (
              <button className="button-stable" onClick={handleButtonClick}>Sign In</button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;