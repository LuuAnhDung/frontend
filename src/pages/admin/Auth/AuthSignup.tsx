import { Col, Row } from 'antd';
import Button from '../../../components/Button';
import './Auth.scss';
import AdminLogin from './Login';
import AdminSignUpRequest from './SignUpRequest';
import { Link } from 'react-router-dom';
const AdminAuthSignUp = () => {
  return (
    <Row className='admin-auth'>
      <Col xs={24} sm={24} md={12} lg={12} xl={10} className='admin-auth__login'>
        <div className='admin-auth__login-container'>
          <h2 className='admin-auth__welcome'>Hello Again!</h2>
          <p className='admin-auth__welcome-back'>Welcome Back</p>
          <AdminSignUpRequest />
          <div className='admin-auth__forgot-password'>
            <Link to='/author-login'>Login</Link>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default AdminAuthSignUp;
