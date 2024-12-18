import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Input, Select, Skeleton, Space } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
//import { startEditBlog } from '../Blog/blog.slice';
import React, { useEffect } from 'react';

import ListDiscuss from './components/ListDisscuss';
import { useGetDiscussQuery, useGetDiscussionsQuery } from './discuss.service';
import { startEditDiscuss } from './discuss.slice';

import { useGetCoursesQuery, useGetSectionsByCourseIdQuery, useGetSectionsQuery } from '../Courses/course.service';
import { useGetUsersQuery } from '../Users/user.service';


const { Search } = Input;
const { Option } = Select;

type ParamsType = {
  _q: string;
  _page: number;
  _limit: number;
  _status?: string;
};

const DiscussCourse = () => {
  const [params, setParams] = useState<ParamsType>({
    _limit: 10,
    _page: 1,
    _q: ''
  });

  const { data: discussResponse, isFetching: isFetchingDiscuss } = useGetDiscussQuery(params);
  const { data: CourseResponse, isFetching: isFetchingCourse } = useGetCoursesQuery(params);
  const { data: UserResponse, isFetching: isFetchingSection } = useGetUsersQuery(params);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const onSearchHandler = (value: string) => {
    setParams((prevParams) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        return {
          ...prevParams,
          _q: trimmedValue,
          _page: 1
        };
      } else {
        return {
          ...prevParams,
          _q: '',
          _page: prevParams._page
        };
      }
    });
  };

  const filterStatusHandler = (value: string) => {
    setParams((prevParams) => {
      return {
        ...prevParams,
        _status: value
      };
    });
  };

  const closeDrawerHandler = () => {
    setOpen(false);
  };

  const onDiscussEdit = (discussId: string) => {
    dispatch(startEditDiscuss(discussId));
    setOpen(true);
  };

  const newDiscussHandler = () => {
    dispatch(startEditDiscuss(''));
    setOpen(true);
  };

  useEffect(() => {
    console.log('discussResponse', discussResponse);
    console.log('discussResponse.discuss', discussResponse?.discusses);
  }, [discussResponse]);

  return (
    <div className='blog-categories'>
      <div className='breakcrumb'>
        <Breadcrumb
          items={[
            {
              title: 'Course'
            },
            {
              title: <Link to='#'>Discuss</Link>
            }
          ]}
        />
      </div>
      <div className='blog-categories__wrap'>
        <div className='blog-categories__filter'>
          <Space className='sub-header__wrap'>
            <Search
              placeholder='Search discuss'
              onSearch={onSearchHandler}
              style={{ width: 200 }}
              className='search-wrap'
            />
            {/* Thêm Select để lọc theo trạng thái */}
            <Select defaultValue='all' style={{ width: 120 }} onChange={filterStatusHandler}>
              <Option value='all'>All</Option>
              <Option value='active'>Active</Option>
              <Option value='inactive'>Inactive</Option>
            </Select>
          </Space>
        </div>
        <div className='blog-categories__content'>
          {isFetchingDiscuss ? (
            <Skeleton />
          ) : (
            <>
            {/* Hiển thị ListDiscuss nếu có dữ liệu */}
            <ListDiscuss
              onDiscussEdit={newDiscussHandler}
              data={discussResponse?.discusses || []}
              courseData={CourseResponse?.courses || []}
              userData={UserResponse?.users || []}
            />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussCourse;