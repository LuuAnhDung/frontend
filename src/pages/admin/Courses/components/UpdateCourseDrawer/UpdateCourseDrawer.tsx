import React, { useEffect } from 'react';
import { Drawer, Form, Button, Input, Select, message } from 'antd';
import { useUpdateCourseMutation, useGetCourseQuery } from '../../course.service';
import { useGetAllCategoriesQuery } from '../../../Categories/category.service';
import { ICourse } from '../../../../../types/course.type';

import axios from "axios";

const { Option } = Select;

interface UpdateCourseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

const UpdateCourseDrawer: React.FC<UpdateCourseDrawerProps> = ({ isOpen, onClose, courseId }) => {
  const [form] = Form.useForm();
  const [updateCourse] = useUpdateCourseMutation();

  const { data: courseData, isLoading: isCourseLoading } = useGetCourseQuery(courseId);
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  
  useEffect(() => {
    if (courseData) {
      const { course } = courseData;

      form.setFieldsValue({
        ...course,
        categoryId: course.categoryId._id
      });
    }
  }, [courseData, form]);

  
  // const handleSubmit = (values: ICourse) => {
  //   console.log('Form Values:', values);
  //   updateCourse(values)
  //     .unwrap()
  //     .then(() => {
  //       void message.success('Course updated successfully');
  //       onClose();
  //       form.resetFields();
  //     })
  //     .catch(() => {
  //       void message.error('Failed to update course');
  //     });
  // };
  const handleSubmit = (values: ICourse) => {
    const payload = { ...values, _id: courseId }; 
    console.log('Payload to API:', payload);
  
    updateCourse(payload)
      .unwrap()
      .then(() => {
        void message.success('Course updated successfully');
        onClose();
        form.resetFields();
      })
      .catch((err) => {
        console.error('API Error:', err);
        void message.error(err?.data?.message || 'Failed to update course');
      });
  };

  return (
    <Drawer
      title='Update Course'
      width={720}
      onClose={onClose}
      open={isOpen}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type='primary'>
            Update
          </Button>
        </div>
      }
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          name='name'
          label='Course Name'
        >
          <Input placeholder='Enter couser name' />
        </Form.Item>
        <Form.Item
          name='categoryId'
          label='Category'
        >
          <Select placeholder='Select a category' loading={isCategoriesLoading}>
            {categoriesData?.categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='description'
          label='Description'
        >
          <Input.TextArea placeholder='Enter description' />
        </Form.Item>
        <Form.Item
          name='thumbnail'
          label='Thumbnail'
        >
          <Input placeholder='Enter thumbnail URL' />
        </Form.Item>
      
        <Form.Item
          name='price'
          label='Price'
        >
          <Input 
            type='number' 
            min={0} 
            placeholder='Enter price'
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (parseFloat(input.value) < 0) {
                input.value = '0'; 
              }
            }} 
          />
        </Form.Item>
        <Form.Item
          name='finalPrice'
          label='Final Price'
        >
          <Input 
            type='number' 
            min={0} 
            placeholder='Enter final price' 
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (parseFloat(input.value) < 0) {
                input.value = '0'; 
              }
            }}/> 
        </Form.Item>
        <Form.Item
          name='subTitle'
          label='Sub Title'
          // rules={[{ required: true, message: 'Please enter the sub title!' }]}
        >
          <Input placeholder='Enter sub title' />
        </Form.Item>
        <Form.Item
          name='courseSlug'
          label='Course Slug'
          // rules={[{ required: true, message: 'Please enter the course slug!' }]}
        >
          <Input placeholder='Enter course slug' />
        </Form.Item>
        <Form.Item name='access' label='Access' >
        {/* rules={[{ required: true, message: 'Please select the access type!' }]} */}
          <Select placeholder='Select access type'>
            <Option value='PAID'>PAID</Option>
            {/* <Option value='DRAFT'>DRAFT</Option>
            <Option value='COMMING_SOON'>COMMING SOON</Option>
            <Option value='ENROLLMENT_CLOSED'>ENROLLMENT CLOSED</Option> */}
            <Option value='FREE'>FREE</Option>
            <Option value='PRIVATE'>PRIVATE</Option>
          </Select>
        </Form.Item>
        {/* <Form.Item name='level' label='Level' rules={[{ required: true, message: 'Please select the level!' }]}> */}
        <Form.Item name='level' label='Level'>
          <Select placeholder='Select level'>
            <Option value='BEGINNER'>BEGINNER</Option>
            <Option value='INTERMEDIATE'>INTERMEDIATE</Option>
            <Option value='ADVANCED'>ADVANCED</Option>
            <Option value='EXPERT'>EXPERT</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='views'
          label='Views'
          // rules={[
          //   { required: true, message: 'Please enter the number of views!' },
          //   {
          //     validator: (_, value) => {
          //       if (value < 0) {
          //         return Promise.reject('Views cannot be negative');
          //       }
          //       return Promise.resolve();
          //     }
          //   }
          // ]}
        >
          <Input 
            type='number' 
            min={0} placeholder='Enter number of views' 
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (parseFloat(input.value) < 0) {
                input.value = '0'; 
              }
            }}/>
        </Form.Item>
        <Form.List name='willLearns'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.key} label={index === 0 ? 'Will Learns' : ''} required={false}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    // rules={[
                    //   {
                    //     required: true,
                    //     whitespace: true,
                    //     message: 'Please input will learn or delete this field.'
                    //   }
                    // ]}
                    noStyle
                  >
                    <Input placeholder='Enter will learn' style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 0 ? (
                    <Button type='dashed' onClick={() => remove(field.name)} style={{ width: '20%' }}>
                      Remove
                    </Button>
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} style={{ width: '60%' }}>
                  Add will learns
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List name='requirements'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.key} label={index === 0 ? 'Requirements' : ''} required={false}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please input requirements or delete this field.'
                      }
                    ]}
                    noStyle
                  >
                    <Input placeholder='Enter requirements' style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 0 ? (
                    <Button type='dashed' onClick={() => remove(field.name)} style={{ width: '20%' }}>
                      Remove
                    </Button>
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} style={{ width: '60%' }}>
                  Add requirements
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List name='tags'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.key} label={index === 0 ? 'Tags' : ''} required={false}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please input tags or delete this field.'
                      }
                    ]}
                    noStyle
                  >
                    <Input placeholder='Enter tags' style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 0 ? (
                    <Button type='dashed' onClick={() => remove(field.name)} style={{ width: '20%' }}>
                      Remove
                    </Button>
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} style={{ width: '60%' }}>
                  Add tags
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
};

export default UpdateCourseDrawer;
