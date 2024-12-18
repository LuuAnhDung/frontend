import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EyeOutlined, HistoryOutlined, StopOutlined, CheckCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { IDiscuss } from '../../../../types/discuss.type';
import { transformDate } from '../../../../utils/functions';
import { message } from 'antd';

import { useState } from 'react';
import { ICourse } from '../../../../types/course.type';
import { useDispatch } from 'react-redux';
import { useDeleteDiscussMutation } from '../discuss.service';
import { startEditDiscuss } from '../discuss.slice';
import ViewDetailDiscuss from './ViewDetailDiscuss';
import { IUser } from '../../../../types/user.type';


interface IDisCussProps {
  data: IDiscuss[];
  courseData: ICourse[];
  userData: IUser[];
  onDiscussEdit: (discussId: string) => void;
}

const ListDiscuss: React.FC<IDisCussProps> = ({onDiscussEdit, data, courseData, userData }) => {

  const dispatch = useDispatch();
  const [discussId, setSelectedCommentsId] = useState('');
  const [discusss, setDiscuss] = useState(data);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteDiscuss] = useDeleteDiscussMutation();

  const getCourseName = (courseId: string) => {
    const courseObj = courseData.find((c) => c._id === courseId);
    return courseObj ? courseObj.name : 'N/A';
  };

  const getUserName = (userId: string) => {
    const userObj = userData.find((c) => c._id === userId);
    return userObj ? userObj.name : 'N/A';
  };

  const getAvatarUser = (userId: string) => {
    const userObj = userData.find((c) => c._id === userId);
    return userObj ? userObj.avatar : 'N/A';
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleViewDetail = (discussId: string) => {
    setDetailVisible(true);
    setSelectedCommentsId(discussId);
  };

  const handleDelete = async (discussId: string) => {
    try {
      await deleteDiscuss(discussId).unwrap(); // `unwrap` để xử lý lỗi rõ ràng hơn
      message.success('Discuss deleted successfully!');
    } catch (error) {
      console.error('Failed to delete discuss:', error);
      message.error('Failed to delete discuss.');
    }
  };

  const discussEditHandler = (discussId: string) => {
    onDiscussEdit(discussId);
    dispatch(startEditDiscuss(discussId));
  };


  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'userId',
      key: 'avatar',
      render: (_: IDiscuss, record: IDiscuss) => {
        console.log('userId:', record.userId); // Debug userId
        const avatar = getAvatarUser(record.userId);
        return (
          <img
            src={typeof avatar === 'string' ? avatar : 'https://imgur.com/GrcbnyD.png'}
            alt="Avatar"
            style={{ width: '50px', height: '50px' }}
          />
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'userId',
      key: 'name',
      render: (_: IDiscuss, record: IDiscuss) => {
        console.log('userId name:', record.userId); // Debug name
        // return <span>{record.userId.name}</span>;
        const userName = getUserName(record.userId); // Sử dụng đúng courseId kiểu string
        return <span>{userName}</span>;
      },
    },
  
    {
      title: 'Course Name',
      dataIndex: 'courseId',
      key: 'courseName',
      render: (_: IDiscuss, record: IDiscuss) => {
        //console.log('courseData:', courseData); // Kiểm tra dữ liệu của courseData
        const courseName = getCourseName(record.courseId); // Sử dụng đúng courseId kiểu string
        return <span>{courseName}</span>;
      },
    },
  
    {
      title: 'Comments',
      dataIndex: 'comment',
      key: 'comment',
      render: (_: IDiscuss, record: IDiscuss) => <span>{record.comment}</span>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: IDiscuss, record: IDiscuss) => (
        <span>{record.createdAt ? transformDate(record.createdAt) : 'N/A'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'status',
      render: (_: IDiscuss, record: IDiscuss) => <span>{record.isDeleted ? 'Inactive' : 'Active'}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: IDiscuss, record: IDiscuss) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleViewDetail(record._id)}
          />
          {/* <Button
            icon={<HistoryOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleViewHistory(record._id)}
          /> */}
          <Popconfirm
            title="Are you sure you want to delete this discuss?"
            placement="topRight"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<StopOutlined style={{ color: '#ff4d4f' }} />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      rowKey="_id"
    />
  );
};

export default ListDiscuss;
