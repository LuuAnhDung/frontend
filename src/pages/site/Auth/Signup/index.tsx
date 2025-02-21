import { FacebookFilled, GithubOutlined, GoogleOutlined, LinkedinFilled, LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Space, notification } from 'antd';
import React, { Fragment, useState } from 'react';
import ButtonCmp from '../../../../components/Button';
import { IUser, UserRole } from '../../../../types/user.type';
import { useSignupMutation } from '../../../auth.service';
import '../Auth.scss';
import { useTranslation } from 'react-i18next';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
interface SignupProps {
  onClick: (authState: string) => void;
}


const Signup: React.FC<SignupProps> = (props) => {
  const [form] = Form.useForm();
  const [signup, signupResult] = useSignupMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {t, i18n} = useTranslation('log');

  const onFinish = (formValues: Omit<IUser, '_id'>) => {

    const newUser: Omit<IUser, '_id'> = {
      email: formValues.email,
      password: formValues.password,
      name: formValues.name,
      phone: formValues.name,
      role: UserRole.USER,
      status: 'ACTIVE'
    };

    setIsSubmitting(true);

    signup(newUser)
      .then((result) => {

        if ('data' in result) {

          const signupResponse: { message: string; userId: string } = result.data;

          notification.success({ type: 'success', message: signupResponse.message });
        }
        if (!signupResult.isLoading) {
          setIsSubmitting(false);
        }

        props.onClick('login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const navigateLoginHandler = (e: React.MouseEvent) => {
    e.preventDefault();

    props.onClick('login');
  };

  return (
    <Fragment>
      <div className='auth__title'>
        <h2 className='auth__title-heading'>{t('log.signup')}</h2>{/* Sign up and start learning */}
      </div>

      <div className='auth__socials'>
        <Space>
          <Button className='auth__socials-btn'>
          <img src="https://res.cloudinary.com/dmj8bakoc/image/upload/v1733879328/google_vbuyct.png" alt="" />
          </Button>
          {/* <Button className='auth__socials-btn'>
            <FacebookFilled className='auth__socials-icon' />
          </Button>
          <Button className='auth__socials-btn'>
            <LinkedinFilled className='auth__socials-icon' />
          </Button> */}
          <Button className='auth__socials-btn'>
            <GithubOutlined className='auth__socials-icon' />
          </Button>
        </Space>
      </div>

      <Divider>Or</Divider>

      <Form
        form={form}
        name='basic'
        layout='vertical'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item wrapperCol={{ span: 24 }} label= {t('log.name')} name='name' rules={[{ required: true }]}>
          <Input className='' />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} label='Email' name='email' rules={[{ required: true, type: 'email' }]}>
          <Input className='' />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} label= {t('log.phone')} name='phone' rules={[{ required: true }]}>
          <Input className='' />
        </Form.Item>

        <Form.Item
          wrapperCol={{ span: 24 }}
          label= {t('log.pass')}   //'Password'
          name='password'
          rules={[
            { required: true, message: t('log.please') }, //'Please input your password!'
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/,
              message: t('log.passmust') //'Password must be at least 8 characters, contain letter, number, and uppercase letter.'
            }
          ]}
        >
          <Input.Password className='' />
        </Form.Item>
        {/* Signup */}
        <Form.Item wrapperCol={{ span: 24 }}>
          <ButtonCmp className='btn btn-primary btn-sm w-full'>{t('log.sign')}</ButtonCmp>
          {/* Signup */}
        </Form.Item>

      </Form>
      <div className='auth__footer'>
        <a onClick={navigateLoginHandler} className='auth__footer-link'>
          {t('log.login')}
          {/* Login */}
        </a>
      </div>
    </Fragment>
  );
};

export default Signup;
