import React, { useState } from 'react';
import { isLoginIdValid, isLoginIdUnique, isEmailUnique, isEmailDomainValid, Register } from './auth';

const RegistrationForm = () => {
    const [loginId, setLoginId] = useState('');
    const [email, setEmail] = useState('');
    const [loginIdError, setLoginIdError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLoginIdChange = async (e) => {
        const newLoginId = e.target.value;
        setLoginId(newLoginId);

        if (!isLoginIdValid(newLoginId)) {
            setLoginIdError('Login ID must be 6-12 alphabetic characters.');
        } else {
            const isUnique = await isLoginIdUnique(newLoginId);
            if (!isUnique) {
                setLoginIdError('Login ID is already taken.');
            } else {
                setLoginIdError('');
            }
        }
    };

    const handleEmailChange = async (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        if (!isEmailDomainValid(newEmail)) {
            setEmailError('Email must end with @gmail.com, @yahoo.com, or @outlook.com.');
        } else {
            const isUnique = await isEmailUnique(newEmail);
            if (!isUnique) {
                setEmailError('Email is already registered.');
            } else {
                setEmailError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Final validation before sending
        if (loginIdError || emailError) {
            return;
        }
        setIsSubmitting(true);
        try {
            await Register('Some Name', email, 'SomePassword', loginId);
            // Handle success (e.g., redirect to OTP verification)
        } catch (error) {
            // Handle registration failure
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Login ID"
                    value={loginId}
                    onChange={handleLoginIdChange}
                />
                {loginIdError && <div style={{ color: 'red' }}>{loginIdError}</div>}
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                />
                {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
            </div>
            <button type="submit" disabled={isSubmitting || loginIdError || emailError}>
                Register
            </button>
        </form>
    );
};

export default RegistrationForm;