/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ApartmentOutlined,
  DingtalkOutlined,
  EditOutlined,
  FlagOutlined,
  FundFilled,
  LeftOutlined,
  RightOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Skeleton, Space } from 'antd';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { RootState } from '../../../store/store';
import { IParams } from '../../../types/params.type';
import { openAuthModal } from '../../auth.slice';
import { Switch } from 'antd';
import {
  useGetCoursesQuery,
  useGetSuggestedCoursesQuery
} from '../client.service';

import CourseList from '../components/CourseList';
import './Home.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { sanitizeAndReturnHtml } from '../../../utils/functions';
import { useTranslation } from 'react-i18next';


type CustomArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

const PrevArrow: React.FC<CustomArrowProps> = ({ className, style, onClick }) => (
  <LeftOutlined
    className={className}
    style={{ ...style, display: 'block', fontSize: '20px', color: '#ccc' }}
    onClick={onClick}
  />
);

const NextArrow: React.FC<CustomArrowProps> = ({ className, style, onClick }) => (
  <RightOutlined
    className={className}
    style={{ ...style, display: 'block', fontSize: '20px', color: '#ccc' }}
    onClick={onClick}
  />
);

const HomePage = () => {
  //const [courseLimit, setCourseLimit] = useState(4);
  const sliderRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const userId = useSelector((state: RootState) => state.auth.userId);
  //const { data, isLoading } = useGetAllBlogsQuery({});

  const settings = {
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: false,
    infinite: false,
    arrows: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4
  };

  const params: IParams = {
    _limit: 4,
    _page: 1
  };

  const [popularParams, setPopularParams] = useState({
    _limit: 4,
    _page: 1,
    _sort: 'mostReviews'
  });

  const [userCoursesParams, setUserCoursesParams] = useState({
    _limit: 999,
    _page: 1,
    userId: userId
  });



  const { data: userSuggestedCoursesData, isFetching: isSuggestedCoursesFetching } = useGetSuggestedCoursesQuery({
    userId,
    limit: 8
  });
  const { data: userCoursesData, isFetching } = useGetCoursesQuery(userCoursesParams);
  
  const { data: popularCoursesData, isFetching: isPoppularCoursesFetching } = useGetCoursesQuery(popularParams);

  const isPopularLoadMore =
    (popularCoursesData?.pagination?._totalRows || 0) > (popularCoursesData?.courses?.length || 0);

  const isUserCoursesLoadMore =
    (userCoursesData?.pagination?._totalRows || 0) > (userCoursesData?.courses?.length || 0);
 
  const suggestedCourses = userSuggestedCoursesData?.suggestedCourses;

  // users courses
  const usersCourses = userCoursesData?.courses.filter((item) => item.isBought);

  // const popularCourses = data?.courses
  const popularCourses = popularCoursesData?.courses;

  // const totalPopularCourses = popularCoursesData?.pagination;

  const startNowHandler = () => {
    if (isAuth) {
      navigate('/start');
    } else {
      dispatch(openAuthModal());
    }
  };

  const popularLoadMoreHandler = () => {
    setPopularParams({
      ...popularParams,
      _limit: (popularParams._limit || 0) + 4
    });
  };

  const usersCoursesLoadMoreHandler = () => {
    setUserCoursesParams({
      ...userCoursesParams,
      _limit: (userCoursesParams._limit || 0) + 4
    });
  };

  const { t, i18n } = useTranslation('home');

  return (
    <div>
      {/*  Banner */}
      <div className='banner'> 
        <div className='banner__wrapper'>
          <div className='container'>
            <div className='banner__wrapper-left'>
              <div className='banner__cta-section'>
                <h1 className='banner__title'>
                {t('home.title')}
                  {/* Online learning is now simpler than ever */}
                  </h1>
                <p className='banner__content'>
                {t('home.content')}
                  {/* EduCo_ is an engaging platform that offers a professional and interactive online learning experience. */}
                </p>
                {/* <div className='banner__cta--btns'>
                  <Space>
                    <Button onClick={startNowHandler} className='banner__cta-start-now btn btn-md btn-secondary'>
                      Start Now
                    </Button>
                    <Link to='/courses'>
                      <Button className='btn btn-md btn-tertiary'>View Courses</Button>
                    </Link>
                  </Space>
                </div> */}
              </div>
            </div>
            <div className='banner__wrapper-right'></div>
          </div>
        </div>
      </div>
      
      {isAuth && userSuggestedCoursesData && userSuggestedCoursesData.suggestedCourses?.length > 4 && (
        <div className={`our-courses-carousel`}>
          <div className='container'>
            <h2 className='our-courses-carousel__title mt-md'>
              {t('home.suggestedcourses')}
              {/* Suggested Courses */}
              </h2>
            {isSuggestedCoursesFetching ? (
              <Skeleton />
            ) : (
              <CourseList
                courseState='notOrdered'
                courses={suggestedCourses}
                isCarousel={true}
                className='our-courses-carousel__wrapper'
              />
            )}
          </div>
        </div>
      )}

      {/* Popular Course Enrolled */}

      {!isAuth && (
        <div className='our-courses'>
          <div className='container'>
            <h2 className='our-courses__title'>
              {t('home.learnerview')}
              {/* Learners are viewing */}
              </h2>
            {isPoppularCoursesFetching ? (
              <Skeleton />
            ) : (
              <CourseList
                courseState='notOrdered'
                onLoadMore={popularLoadMoreHandler}
                isLoadMore={isPopularLoadMore}
                courses={popularCourses}
                className='our-courses__wrapper'
              />
            )}
          </div>
        </div>
      )}

      {/* Courses */}

      {isAuth && (
        <div className={`our-courses`}>
          <div className='container'>
            <h2 className='our-courses__title'>
              {t('home.ourcourse')}
              {/* Our Courses */}
              </h2>
            {isFetching ? (
              <Skeleton />
            ) : (
              <CourseList
                courseState='notOrdered'
                courses={usersCourses}
                onLoadMore={usersCoursesLoadMoreHandler}
                isLoadMore={isUserCoursesLoadMore}
                className='our-courses__wrapper'
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
