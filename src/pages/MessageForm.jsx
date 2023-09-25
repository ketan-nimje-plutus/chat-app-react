import React, { useState } from 'react'
import "../../src/assets/CSS/messageForm.css";
function MessageForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can perform form submission logic here
        // For this example, we'll just log the form data
        console.log(formData);
    };

    return (
        <div className='body'>
            <h2 className='title'>Contact Form</h2>
            <form onSubmit={handleSubmit} className='Form'>
                <div >
                    <label htmlFor="fullName">Full Name:</label>
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
                <div>
                    <label htmlFor="email">Email:</label>
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
                <div>
                    <label htmlFor="contactNumber">Contact Number:</label>
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
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className='InputValue'
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default MessageForm