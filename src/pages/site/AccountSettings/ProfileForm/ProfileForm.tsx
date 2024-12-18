import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, notification, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './ProfileForm.module.scss';
import { getUserResponse, useUpdateUserMutation } from '../../client.service';
import { IUser } from '../../../../types/user.type';
import { useTranslation } from 'react-i18next';

const ProfileForm: React.FC<{ userData: getUserResponse | undefined, isSuccess: boolean, userId: string }> = ({ userData, isSuccess, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const {t, i18n} = useTranslation('account');

  const handleFormChange = (_: IUser, allValues: IUser) => {
    setIsFormChanged(JSON.stringify(allValues) !== JSON.stringify(formInitialValues));
  };

  useEffect(() => {
    if (isSuccess && userData) {
      const initialValues = {
          name: userData.user.name,
          email: userData.user.email,
          phone: userData.user.phone,
          // language: userData.user.language
      };

      form.setFieldsValue(initialValues);
      setFormInitialValues(initialValues);
      setIsFormChanged(false);
    }
  }, [userData, isSuccess, form]);

  const [updateUser] = useUpdateUserMutation();

  const { Option } = Select;

  const handleFinish = (values: IUser) => {
    onFinish(values).catch((error) => {
      console.error('Error during form submission:', error);
    });
  };


  // const onFinish = async (values: IUser) => {
  //   setLoading(true);
  //   const formData = new FormData();
  //   Object.keys(values).forEach((key) => {
  //     const value = values[key as keyof IUser];
  //     if (value !== undefined && value !== null) {
  //       formData.append(key, value.toString());
  //     }
  //   });
  //   console.log('FormData Entries:', Array.from(formData.entries()));
  //   try {
  //     const result = await updateUser({ userId, formData }).unwrap();
  //     notification.success({
  //       message: 'Success',
  //       description: result.message,
  //       placement: 'topRight',
  //     });
  //     setFormInitialValues(values);
  //     setIsFormChanged(false);
  //   } catch (error) {
  //     notification.error({
  //       message: 'Error',
  //       description: 'Error updating profile',
  //       placement: 'topRight',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onFinish = async (values: IUser) => {
    setLoading(true);
    const formData = new FormData();
  
    // Chuyển các giá trị trong IUser sang FormData
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof IUser];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
  
    try {
      const result = await updateUser({
        userId,
        formData
      }).unwrap();
  
      notification.success({
        message: 'Success',
        description: result.message,
        placement: 'topRight',
      });
      setFormInitialValues(values);
      setIsFormChanged(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error updating profile',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };
  
  


  return (
    <Form onValuesChange={handleFormChange} form={form} layout='vertical' onFinish={handleFinish} requiredMark={false} className={styles.profileForm}>
      <Row gutter={{ xs: 24, lg: 32 }}>
        <Col xs={24} md={18} lg={12}>
          <Form.Item
            name='name'
            label= {t('account.fullname')} //'Full Name'
            className={styles.profileForm__item}
            rules={[{ 
            required: true, 
            message: t('account.plname') //'Please input your full name!' 
            }]}
          >
            <Input className={styles.profileForm__input} />
          </Form.Item>

          <Form.Item
            name='email'
            label= {t('account.email')} //'Email'
            className={styles.profileForm__item}
            rules={[
              {
                required: true,
                message: t('account.plemail') //'Please input your email!'
              },
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              }
            ]}
          >
            <Input className={styles.profileForm__input} />
          </Form.Item>

          <Form.Item
            name='phone'
            label= {t('account.phone')} //'Phone'
            className={styles.profileForm__item}
            rules={[
              {
                required: true,
                message: t('account.plphone') //'Please input your phone number!'
              },
              {
                pattern: new RegExp(/^[0-9+\-\s()]+$/),
                message: 'Please input a valid phone number!'
              }
            ]}
          >
            <Input className={styles.profileForm__input} />
          </Form.Item>
        </Col>
        
      </Row>

      <Form.Item className={styles.profileForm__submit}>
        <Button type='primary' htmlType='submit' block disabled={!isFormChanged}>
          {loading ? <Spin indicator={antIcon} /> : t('account.save')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
