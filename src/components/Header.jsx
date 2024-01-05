import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const [buttonClicked, setButtonClicked] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Perform any necessary actions before navigation
    // For example, you might want to show a loading spinner or trigger an API call

    // Set the buttonClicked state to true
    setButtonClicked(true);

    // Redirect to the sign-in page
    navigate('/sign-in');
  };

  useEffect(() => {
    // Reset the buttonClicked state when the location changes
    setButtonClicked(false);
  }, [location.pathname]);

  return (
    <header className="bg-emerald-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
          <h1 className="flex flex-wrap items-center font-bold text-sm sm:text-xl">
            <img className="mr-2" src="../DID-logo.svg" alt="DID Logo" width={50} />
            <span className="text-indigo-800">Dial-</span>
            <span className="text-indigo-700">In-</span>
            <span className="text-indigo-600">Depth</span>
          </h1>
        </Link>
        <form action="" className="flex items-center bg-slate-100 border-double border-4 border-indigo-600 p-3 rounded-lg">
          <input type="text" name="search" id="search" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
          <FaSearch className='text-slate-500' />
        </form>
        <ul className="flex items-center gap-5">
          <Link to='/'>
            <li className="hidden sm:inline text-indigo-700 hover:underline">Home</li>
          </Link>
          <Link to='/about'>
            <li className="hidden sm:inline text-indigo-700 hover:underline">About</li>
          </Link>
          <li>
            {buttonClicked || location.pathname === '/sign-in' ? (
              <button className={`bg-indigo-800 text-white px-4 py-2 rounded-md opacity-50 cursor-not-allowed disabled:opacity-50 disabled:bg-gray-400 focus:outline-none focus:bg-gray-600 focus:ring focus:border-indigo-300`} disabled>Signing In...</button>
            ) : (
              <button className={`bg-indigo-800 text-white px-4 py-2 rounded-md focus:outline-none focus:bg-gray-600 focus:ring focus:border-indigo-300`} onClick={handleButtonClick}>Sign In</button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;