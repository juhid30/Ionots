import axios from "axios";

const DashboardHeader = ({ title }) => {
  const handleLogout = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      // Redirect to login page or perform any other action after logout
      window.location.href = "/"; // Example of redirect
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <>
      <header className="h-[7rem] flex items-center justify-center">
        <h1 className="text-5xl font-bold">{title}</h1>
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-600 absolute top-10 right-10 text-white py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </header>
    </>
  );
};

export default DashboardHeader;
