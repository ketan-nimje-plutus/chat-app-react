import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errorToast } from "../Components/Toast";

function Home() {
  const notify = () => errorToast("errrrooo");
  return (
    <>
      
        <div className="Welcome">
          <h1>Welcome To Chat App</h1>
        </div>
      
    </>
  );
}

export default Home;

