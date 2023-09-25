import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errorToast } from "../Components/Toast";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/CSS/Home.css";
function Home() {
  // const notify = () => errorToast("errrrooo");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <div className="Welcome">
        <div>
          <div className='body'>
            <div><h3 className='title'>Welcome! How can we help?</h3></div>
            <form onSubmit={handleSubmit} className='Form'>
              <div className="InputBox">
                <label className="lable" htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className='InputValue'
                />
              </div>
              <div className="InputBox">
                <label className="lable" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='InputValue'
                />
              </div>
              <div className="InputBox">
                <label className="lable" htmlFor="contactNumber">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className='InputValue'
                />
              </div>
              {/* <div>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className='InputValue'
                />
              </div> */}
            </form>
          </div>
          <Button className='Button' onClick={() => navigate("/chat")}>Start Chat</Button>
        </div>
      </div>

    </>
  );
}

export default Home;
