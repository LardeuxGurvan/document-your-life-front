/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import getUserData from '../../RequestsAxios/userData';
import { Link } from 'react-router-dom';
import Spinner from '../../utils/Spinner/Spinner';
import './profilePage.scss';


const ProfilePage = () => {
    const iniState = {
        email: "Email",
        first_name: "Prénom",
        last_name: "Nom",
    }
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(iniState);

    async function loadUser() {
        const response = await getUserData()
        if (response.status === 200) {
            console.log(response)
            setUser(response.data)
            return setLoading(false)
        }
        return console.log('end of action')
    }
    useEffect(() => {
        loadUser()
    }, []);

    return (
        <>
            {loading ? <Spinner /> : (
                <>
                    <Link className='retourn' to="/dashboard/calendar">
                        retourn
                    </Link>
                    <div className='profilPage'>
                        <p className='profilPage-personal-avatar'>Avatar</p>
                        <ul className='profilPage-personal'>
                            <li className='profilPage-personal-credentials'>{user.email}</li>
                            <li className='profilPage-personal-credentials'>{user.first_name}</li>
                            <li className='profilPage-personal-credentials'>{user.last_name}</li>
                        </ul>
                    </div>
                </>
            )
            }
        </>
    );
};

ProfilePage.propTypes = {
};
ProfilePage.defaultProps = {
};
export default ProfilePage
