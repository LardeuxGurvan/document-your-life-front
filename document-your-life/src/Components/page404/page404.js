import React from 'react';
import './page404.scss';
import { Link } from 'react-router-dom';

const Page404 = () => {   
   return (
       <div className='page404'>
            <h1 className='page404-title'>404</h1>
            <h2 className='page404-subtitle'>Oups, on s&#39;est perdu ?</h2>
            <Link className='page404-redirect' to='/'>C&#39;est par ici</Link>
        </div>
   );
};
export default React.memo(Page404);
