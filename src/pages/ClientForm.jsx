import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { loginUser } from "../redux/feature/clientSlice";
import { useEffect, useState } from "react";
import { errorToast } from "../Components/Toast";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import login from "../../public/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope, faMobileAlt, faComment } from "@fortawesome/free-solid-svg-icons";
import { getdata } from "../Utils/http.class";


let userList = [];

function ClientForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggin, errorMsg } = useSelector((state) => state.client);
    const [onlineUser, setOnlineUser] = useState([]);
    const [oUser, setOUser] = useState([]);
    const [contact, setContact] = useState();
    const { values, handleChange, handleSubmit } = useFormik({
        initialValues: {
            name: "",
            email: "",
            contactNumber: "",
        },
        onSubmit: (event) => {
            dispatch(loginUser(values));
        },
    });

    //Is Online

    const getUsers = async () => {
        const res = await getdata("user/getUser");
        const response = await res.json();
        setContact(response.users);
    };
    useEffect(() => {
        getUsers();
    }, []);


    userList = contact?.map((data) => { data });
    useEffect(() => {
        if (socket) {
            socket.on("online-user", (data) => {
                setOUser(data)
                data.forEach((element) => {
                    let index = userList?.findIndex((item) => item?._id == element?.userID);
                    if (index >= 0) {
                        userList[index].socketid = data.socketId;
                    }
                });
                setOnlineUser(data);
            });
        }
    }, [socket, userList]);
    if (oUser.length > 0) {
        localStorage.setItem('currentChat', JSON.stringify(oUser[0]))
    }
    useEffect(() => {
        if (errorMsg !== null) {
            errorToast(errorMsg);
        }
    }, [errorMsg]);

    if (isLoggin) {
        navigate("/client-chat");
    }



    return (
        <>
            {oUser.length > 0 ?

                <Container className="p-4  Welcome">
                    <Row>
                        {/* <Col md={6}>
                            <img src={login} className="w-100" />
                        </Col> */}
                        <Col md={12}>
                            <div className="register-form">
                            <h3>BD is online <b/> Please fill out the form. </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faUser} />
                                            <input
                                                placeholder="Enter Name"
                                                type="text"
                                                name="name"
                                                onChange={handleChange}
                                                value={values.name}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            <input
                                                placeholder="Enter Email"
                                                type="text"
                                                name="email"
                                                onChange={handleChange}
                                                value={values.email}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faMobileAlt} />
                                            <input
                                                type="number"
                                                name="contactNumber"
                                                placeholder="Enter Contact Number"
                                                onChange={handleChange}
                                                value={values.contactNumber}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-submit">
                                        <Button className="submit-button" type="Submit">talk with sales</Button>
                                    </div>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
                :
                <Container className="p-4  Welcome">
                    <Row>

                        <Col md={6}>
                            {/* <img src={login} className="w-100" /> */}
                        </Col>

                        <Col md={12}>

                            <div className="register-form">
                                {/* <h1>Sign In</h1> */}
                                <h3>All the BDs are offline for further information, please leaving  message</h3>
                                <form>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faUser} />
                                            <input
                                                placeholder="Enter Name"
                                                type="text"
                                                name="name"
                                            // onChange={handleChange}
                                            // value={values.name}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            <input
                                                placeholder="Enter Email"
                                                type="text"
                                                name="email"
                                            // onChange={handleChange}
                                            // value={values.email}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faMobileAlt} />
                                            <input
                                                type="number"
                                                name="contactNumber"
                                                placeholder="Enter Contact Number"
                                            // onChange={handleChange}
                                            // value={values.contactNumber}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faComment} />
                                            <input
                                                type="text"
                                                name="message"
                                                placeholder="Enter Message"
                                            // onChange={handleChange}
                                            // value={values.contactNumber}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-submit">
                                        <Button className="submit-button" type="Submit">Send To Mail</Button>
                                    </div>
                                </form>
                                {/* <div>
                   New User? <Link to="/register">Create Account</Link>
                 </div> */}
                            </div>
                        </Col>
                    </Row>
                </Container>
            }


        </>
    );
}

export default ClientForm;
