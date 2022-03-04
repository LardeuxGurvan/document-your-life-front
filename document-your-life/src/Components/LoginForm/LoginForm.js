/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import PropTypes from 'prop-types'

// react-router-dom
import { useNavigate } from "react-router-dom";

// scss
import './loginForm.scss';

import LoginAxios from '../../RequestsAxios/LoginRequest';
import Notify from '../../utils/notifyFunc';

const LoginForm = ({ setIsConnected }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submited, setSubmited] = useState(true)
    let navigate = useNavigate();
    /**
     * @function handleSubmit
     * @param {*} e 
     * use to prevent reload
     * set a condition for the submit
     * conditions:
     * -checkbox checked
     * -all inputs completed 
     * -and same passwort and password confirmation
     */
    async function handleSubmit(e) {
        e.preventDefault();
        const response = await LoginAxios(
            email, password
        )
        console.log(response.data)
        setSubmited(!submited)
        LoginAxios(email, password)
        if (response.status === 200) {
            setIsConnected(false)
            localStorage.setItem('token', response.data.tokenGenerated)
            localStorage.setItem('userId', response.data.userId)
            navigate('/dashboard/calendar', { replace: true })
        } else {
            setIsConnected(true)
            Notify("Attention, votre identifiant ou votre mot de passe est incorrect.", "warning")
        }
    }
    return (
        <div className='formLogin'>
            <h2 className='formLogin-title'>Connexion</h2>
            <form className='formLogin-form' onSubmit={handleSubmit}>
                <p className='formLogin-form-title'>Email</p>
                <input
                    className='formLogin-form-input'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder='Entrez votre Email' />

                <p className='formLogin-form-title'>Mot de passe</p>
                <input
                    className='formLogin-form-input'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder='Entrez votre Mot de passe' />
                <div className='button-container'>
                    <button type="submit" className="AllButton">
                        <p className='AllButton-text'>Envoyer</p>
                    </button>
                </div>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    setIsConnected: PropTypes.func
};
export default React.memo(LoginForm);
