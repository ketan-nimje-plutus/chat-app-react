import { useFormik } from "formik";
import { postdata } from "../Utils/http.class";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../Components/Toast";
import "../../src/assets/CSS/register.css";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import login from "../../public/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";


function Register() {
  const navigate = useNavigate();
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      contactNumber: "",
    },
    onSubmit: () => {
      register();
    },
  });
  const register = async () => {
    const res = await postdata("user/register", values);
    const response = await res.json();
    if (response.status === 1) {
      navigate("/login");
    } else {
      errorToast(response.message);
    }
  };
  return (
    <Container className="p-4  Welcome">
      <Row>
        {/* <Col md={6}>
          <img src={login} className="w-100" />
        </Col> */}
        <Col md={12}>
          <div className="body">
            <h1>Sign Up</h1>
            {/* <form onSubmit={handleSubmit}>
              <div className="input-container">
                <div className="input">
                  {" "}
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    type="text"
                    name="fullName"
                    onChange={handleChange}
                    value={values.fullName}
                    placeholder="enter username "
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <input
                    type="text"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    placeholder="enter email"
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="enter contactNumber"
                    onChange={handleChange}
                    value={values.contactNumber}
                  />
                </div>
              </div>
              <div className="input-submit">
                <input className="submit-button" type="Submit"></input>
              </div>
            </form> */}
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
                <Button className="submit-button" type="Submit">Submit</Button>
              </div>
              {/* <Button className='Button' type="Submit" onClick={() => navigate("/chat")}>Start Chat</Button> */}
            </form>
            <div>
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
