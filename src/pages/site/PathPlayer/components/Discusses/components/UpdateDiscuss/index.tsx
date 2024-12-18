/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Modal, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useGetDiscussionsByIdQuery, useUpdateDiscussionMutation } from '../../../../../client.service';

interface UpdateDiscussProps {
  isUpdateModalVisible: boolean;
  setIsUpdateModalVisible: (isVisible: boolean) => void;
  discussId: string;
  handleOk: () => void;
  handleCancel: () => void;
}

interface DiscussionFormValues {
  comment: string;
}

const UpdateDiscuss: React.FC<UpdateDiscussProps> = ({
  isUpdateModalVisible,
  setIsUpdateModalVisible,
  discussId,
  handleOk,
  handleCancel
}) => {
  const [form] = Form.useForm();
  const id = discussId;
  const { data, isLoading, isError } = useGetDiscussionsByIdQuery(id);
  const [updateDiscussion] = useUpdateDiscussionMutation();
  const dataComments = data?.discuss;
  useEffect(() => {
    if (dataComments && dataComments.length > 0) {
      const comments = dataComments.map((item) => item.comment); // Lấy tất cả các comment
      form.setFieldsValue({ comment: comments.join(', ') }); // Ghép các comment thành một chuỗi (nếu cần)
    }
  }, [dataComments, form]);

  const handleUpdate = async (values: DiscussionFormValues) => {
    try {
      if (!values.comment?.trim()) {
        message.error('Comment cannot be empty');
        return;
      }
      await updateDiscussion({ discussId, comment: values.comment }).unwrap();
      message.success('Discussion updated successfully');
      setIsUpdateModalVisible(false);
    } catch (error) {
      message.error('Failed to update discussion');
    }
  };

  return (
    <Modal
      title='Update Discussion'
      visible={isUpdateModalVisible}
      onOk={form.submit}
      onCancel={handleCancel}
      width={800}
    >
      <Form form={form} onFinish={handleUpdate} layout='vertical'>
        <Form.Item name='comment' label='Comments' rules={[{ required: true, message: 'Please input the content!' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateDiscuss;
