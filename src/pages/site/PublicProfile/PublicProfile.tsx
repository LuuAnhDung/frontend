import React, { Fragment } from 'react'
import UserProfile from './components/UserProfile';
import { Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';

const PublicProfile = () => {
  return (
    <div>
    <div className='mx-auto px-4 pb-20 pt-40'> 
        <UserProfile name={'Dung'} bio={'Dung'} avatarUrl={''} />
    </div>
    
    <div className='container mx-auto px-4 pb-20 pt-40'>
      <Outlet/>
    </div>
    
  </div>

  )
}

export default PublicProfile;