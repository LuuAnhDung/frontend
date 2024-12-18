/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Card, Form, Input, notification } from 'antd';
import { useState } from 'react';
import { useAddDiscussionMutation } from '../../../../../client.service';
import { useTranslation } from 'react-i18next';

interface DiscussionFormValues {
  userId: string;
  courseId: string;
  comment: string;
}

interface DiscussFormProps {
  userId: string;
  //lessonId: string;
  courseId: string;
}

const DiscussForm: React.FC<DiscussFormProps> = ({ userId, courseId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [addDiscussion, { isLoading, isSuccess, isError, error }] = useAddDiscussionMutation();

  const {t, i18n} = useTranslation('discuss');
  // const onFinish = async (values: DiscussionFormValues) => {
  //   try {
  //     await addDiscussion({
  //       //title: values.title,
  //       userId,
  //       //parentDiscussId: values.parentDiscussId,
  //       //lessonId,
  //       courseId,
  //       comments: values.comments
  //     }).unwrap();
  //     notification.success({
  //       message: 'Discussion has been added!',
  //       description: 'Your discussion has been successfully created.'
  //     });
  //     setIsVisible(false);
  //   } catch (err) {
  //     notification.error({
  //       message: 'Error!',
  //       description: 'Unable to add discussion. Please try again.'
  //     });
  //   }
  // };
  const onFinish = async (values: DiscussionFormValues) => {
    try {
      // Gửi dữ liệu thảo luận đến API backend
      await addDiscussion({
        userId, // Giả sử 'userId' là ID người dùng đã đăng nhập
        courseId, // Giả sử 'courseId' được lấy từ context hoặc state
        comment: values.comment, // Chắc chắn rằng 'comments' là giá trị bạn muốn gửi
        
      }).unwrap();
  
      // Hiển thị thông báo thành công
      notification.success({
        message: 'Discussion has been added!',
        description: 'Your discussion has been successfully created.',
      });
  
      // Đóng form hoặc modal sau khi thêm thành công
      setIsVisible(false); // Giả sử 'setIsVisible' là hàm để đóng modal hoặc form
    } catch (err: any) {
      console.error('Error adding discussion:', err);
      const errorMessage = err?.data?.message || 'Unable to add discussion. Please try again.';
    
      // Hiển thị lỗi trên giao diện
      notification.error({
        message: 'Error!',
        description: errorMessage,
      });

      notification.error({
        message: 'Error!',
        description: 'Unable to add discussion. Please try again.',
      });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <Button type='link' onClick={() => setIsVisible(!isVisible)} className='mb-2'>
          {isVisible ? t('discuss.close') : t('discuss.create')}
      </Button>
      {isVisible && (
        <Card className='mb-2'>
          <Form name='discussForm' onFinish={onFinish} layout='vertical'>
            <Form.Item
              label= {t('discuss.comment')}
              name = 'comment'
              // name='comment'
              rules={[{ required: true, message: t('discuss.message') }]}
            >
              <Input.TextArea rows={4} placeholder= {t('discuss.enter')} />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
              {t('discuss.submit')}
                {/* Submit */}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default DiscussForm;
