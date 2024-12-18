/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { Form, Input, Button, notification, Divider, Card } from 'antd';
import { LockOutlined, BookOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
//import { useChangePasswordMutation } from '../Users/user.service';
import { useChangePasswordMutation } from '../../auth.service';

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const userId = useSelector((state: RootState) => state.auth.adminId);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (values: { oldPassword: string; newPassword: string; confirmNewPassword: string }) => {
    try {
      await changePassword({
        userId,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      }).unwrap();

      notification.success({
        message: 'Password Changed',
        description: 'Your password has been changed successfully!'
      });

      form.resetFields();
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: 'Error',
        description: 'An error occurred while changing your password!'
      });
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: 'auto', paddingTop: 50 }}>
      <Card>
        <h1 className='text-4xl text-center mb-10'>Change Password</h1>

        {/* Divider for visual separation */}
        <Divider type='vertical' style={{ height: 'auto' }} />

        {/* Change Password Form Side */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Form form={form} name='changePasswordForm' onFinish={handleSubmit} autoComplete='off'>
            <Form.Item name='oldPassword' rules={[{ required: true, message: 'Please input your old password!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder='Old Password' />
            </Form.Item>
            <Form.Item
              name='newPassword'
              rules={[
                { required: true, message: 'Please input your new password!' },
                { max: 8, message: 'Password must be maximum 8 characters.' }
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder='New Password' />
            </Form.Item>
            <Form.Item
              name='confirmNewPassword'
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  }
                }),
                { max: 8, message: 'Password must be maximum 8 characters.' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder='Confirm New Password' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' block loading={isLoading}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
      {/* Clear floats */}
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};

export default ChangePassword;
