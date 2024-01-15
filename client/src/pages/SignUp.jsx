import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form action="" className="flex flex-col gap-4">
        <input type="text" placeholder="Username" className="border p-3 rounded-lg " id="username" />
        <input type="email" placeholder="Email" className="border p-3 rounded-lg" id="email" />
        <input type="password" placeholder="Password" className="border p-3 rounded-lg" id="password" />
        <button className="bg-indigo-800 text-white px-4 py-2 rounded-md focus:outline-none focus:bg-gray-600 focus:ring focus:border-indigo-300">Sign Up</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an Account?</p>
        <Link to={"/sign-in"}>
          <span className="text-indigo-700 hover:underline">Sign In</span>
        </Link>
      </div>
    </div>  
  )
}
