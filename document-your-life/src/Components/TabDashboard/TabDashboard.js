/* eslint-disable react/jsx-key */
import React from 'react'
import { Link } from 'react-router-dom'
import './tabDashboard.scss';

// React Router Dom
import { Routes, Route } from "react-router-dom";

// Components
import Calendar from '../Calendar/Calendar';


const TabDashboard = () => {
  return (
    <div className='dashboard-container'>
      <div className='container'>

        <div className='tab-dashboard'>
          <Link to="yesterday" className='tab-dashboard-link'>Hier</Link>
          <Link to="calendar" className='tab-dashboard-link'>Calendrier</Link>
          <Link to="today" className='tab-dashboard-link'>Aujourdhui</Link>
        </div>

      </div>
      <Routes>
        <Route path="/calendar" element={
          <Calendar />}
        />
      </Routes>
    </div>
  )
}

TabDashboard.propTypes = {}

export default React.memo(TabDashboard);