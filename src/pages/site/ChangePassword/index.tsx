/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useChangePasswordMutation } from '../../auth.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useTranslation } from 'react-i18next';


const ChangePasswordUser: React.FC = () => {
  const [form] = Form.useForm();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [changePassword, { isLoading }] = useChangePasswordMutation();


  const handleSubmit = async (values: { oldPassword: string; newPassword: string; confirmNewPassword: string }) => {
    console.log('Id', userId);
    console.log("Submitted values: ", values);
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

  const {t, i18n} = useTranslation('changepass');


  return (
    <div className='container' style={{ maxWidth: 360, margin: 'auto', paddingTop: '16rem', paddingBottom: '16rem' }}>
      <h1 className='text-center mb-10 mt-10 font-bold text-4xl'>{t('changepass.change')}</h1>
      <Form form={form} name='changePasswordForm' onFinish={handleSubmit} layout='vertical' autoComplete='off'>
        <Form.Item name='oldPassword' rules={[{ required: true, message: t('changepass.plcurrent') }]}> 
          <Input.Password prefix={<LockOutlined />} placeholder = {t('changepass.current')} />
        </Form.Item>

        <Form.Item
          name='newPassword'
          rules={[
            { required: true, message: t('changepass.plnew') },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/,
              message: t('changepass.plmust') //'Password must be at least 8 characters, contain a letter, a number, and an uppercase letter.'
            } 
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder = {t('changepass.new')} />
        </Form.Item>

        <Form.Item
          name='confirmNewPassword'
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: t('changepass.plconfirm')  },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error( t('changepass.pltwo') ));
              }
            })
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder = {t('changepass.confirm')} />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            {t('changepass.change')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordUser;
