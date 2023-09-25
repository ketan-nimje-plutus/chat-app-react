import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/feature/authSlice";
import { useEffect } from "react";
import { errorToast } from "../Components/Toast";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import login from "../../public/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggin, errorMsg } = useSelector((state) => state.auth);
  console.log(isLoggin, 'isLoggin ');
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      contactNumber: "",
    },
    onSubmit: () => {
      dispatch(loginUser(values)); // Dispatch the action when the form is submitted
    },
  });

  useEffect(() => {
    console.log(errorMsg,'errorMsg')
    if (errorMsg !== null) {
      errorToast(errorMsg);
    }
  }, [errorMsg]);

  if (isLoggin) {
    navigate("/chat");
  }
  return (
    <>
      <Container className="p-4  Welcome">
        <Row>
          <Col md={6}>
            <img src={login} className="w-100" />
          </Col>
          <Col md={6}>
            <div className="register-form">
              <h1>Sign In</h1>
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <div className="input">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      placeholder="enter Fullname"
                      type="text"
                      name="fullName"
                      onChange={handleChange}
                      value={values.fullName}
                    />
                  </div>
                </div>
                <div className="input-container">
                  <div className="input">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      placeholder="enter email"
                      type="text"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                    />
                  </div>
                </div>
                <div className="input-container">
                  <div className="input">
                    <FontAwesomeIcon icon={faLock} />
                    <input
                      placeholder="enter contactNumber"
                      type="text"
                      name="contactNumber"
                      onChange={handleChange}
                      value={values.contactNumber}
                    />
                  </div>
                </div>
                <div className="input-submit">
                  <input className="submit-button" type="Submit"></input>
                </div>
              </form>
              <div>
                New User? <Link to="/register">Create Account</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
