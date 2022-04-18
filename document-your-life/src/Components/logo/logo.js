// Import context
import React, { memo } from 'react';
import './logo.scss';
import logo from '../../LogoDyl/dyllogo.png';
//==================

const Logo = () => {
    return (
        <div className='logo'>
            <img className='logo-image' src={logo} alt='Document your life main icon' />
        </div>
    )
}

export default memo(Logo);