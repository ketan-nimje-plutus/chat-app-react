import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/feature/authSlice";
import { useEffect } from "react";
import { errorToast } from "../Components/Toast";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import login from "../../public/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "../assets/CSS/Home.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggin, errorMsg, isLoggedIn } = useSelector((state) => state.auth);
  console.log(isLoggin, 'isLoggin')
  console.log(isLoggedIn, 'isLoggedIn')
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      contactNumber: "",
    },
    onSubmit: () => {
      dispatch(loginUser(values));
    },
  });

  useEffect(() => {
    if (errorMsg !== null) {
      errorToast(errorMsg);
    }
  }, [errorMsg]);

  if (isLoggin) {
    navigate("/chat");
  }


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
                  // placeholder="enter Fullname"
                  type="text"
                  name="fullName"
                  className='InputValue'

                  onChange={handleChange}
                  value={values.fullName}
                />
              </div>
              <div className="InputBox">
                <label className="lable" htmlFor="email">Email</label>

                <input
                  // placeholder="enter email"
                  type="text"
                  name="email"
                  onChange={handleChange}
                  className='InputValue'

                  value={values.email}
                />
              </div>
              <div className="InputBox">
                <label className="lable" htmlFor="contactNumber">Contact Number</label>
                <input
                  // placeholder="enter contactNumber"
                  type="text"
                  name="contactNumber"
                  onChange={handleChange}
                  value={values.contactNumber}
                  className='InputValue'

                />
              </div>
              {/* <div>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  required
                  className='InputValue'
                />
              </div> */}
              <div className="input-submit">
                <Button className="submit-button" type="Submit">Talks with sales</Button>
              </div>
              {/* <Button className='Button' type="Submit" onClick={() => navigate("/chat")}>Start Chat</Button> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

