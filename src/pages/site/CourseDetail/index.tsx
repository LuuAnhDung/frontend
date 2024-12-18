import { CheckOutlined, HeartOutlined, RightCircleFilled, StarFilled, HeartFilled } from '@ant-design/icons';
import { Breadcrumb, Button, Col, List, Row, Skeleton, Space, Typography, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ButtonCmp from '../../../components/Button';
import { BACKEND_URL } from '../../../constant/backend-domain';
import { RootState } from '../../../store/store';
import { AccessStatus, CourseLevel } from '../../../types/course.type';
import { IOrder } from '../../../types/order.type';
import { formatVideoLengthToHours, transformDate } from '../../../utils/functions';
import { openAuthModal } from '../../auth.slice';
import RelatedCourses from './components/RelatedCourses/RelatedCourses';
import {
  useCreateOrderMutation,
  useGetCourseDetailQuery,
  useGetSectionsByCourseIdQuery,
  useGetUserQuery,
  useIncreaseCourseViewMutation,
  useCreateWishlistMutation,
  useDeleteWishlistMutation,
  useGetCourseIdsFromWishlistByUserIdQuery
} from '../client.service';
import { addToCart } from '../client.slice';
import './CourseDetail.scss';
import SectionList from './components/SectionList';
import ReviewModal from './components/ReviewModal/ReviewModal';
import PreviewModal from './components/PreviewModal/PreviewModal';
import { useTranslation } from 'react-i18next';

const initCourseDetail = {
  _id: '',
  name: '',
  description: '',
  price: 0,
  finalPrice: 0,
  access: AccessStatus.FREE,
  level: CourseLevel.BEGINNER,
  thumbnail: '',
  courseSlug: '',
  categoryId: {
    _id: '',
    name: ''
  },
  userId: {
    _id: '',
    name: '',
    avatar: ''
  },
  authorId: {
    _id: '',
    name: '',
    avatar: '',
    biography: ''
  },
  numOfReviews: 0,
  totalVideosLength: 0,
  sections: 0,
  lessons: 0,
  students: 0,
  avgRatingStars: 0,
  isBought: false,
  createdAt: '',
  updatedAt: '',
  views: 0
};

const CourseDetail = () => {
  // HOOKS HERE
  const params = useParams();
  const dispatch = useDispatch();
  
  const userId = useSelector((state: RootState) => state.auth.userId);

  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  const { data: userData } = useGetUserQuery(userId);

  const { courseId } = params;

  const [increaseCourseView] = useIncreaseCourseViewMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  const [visibleCourseData, setVisibleCourseData] = useState<number>(10);

  const { data, isFetching } = useGetCourseDetailQuery({ courseId, userId } as { courseId: string; userId: string });

  const courseData = data?.course.willLearns || [];

  
  const [createWishlist] = useCreateWishlistMutation();
  const [deleteWishlist] = useDeleteWishlistMutation();
  const { data: wishlistData } = useGetCourseIdsFromWishlistByUserIdQuery(userId, {
    skip: !userId || !isAuth
  });
  const wishlistCourseIds: string[] = wishlistData?.data || [];
  const isCourseInWishlist = wishlistCourseIds.includes(courseId || '');

  const { t, i18n } = useTranslation('coursedetail'); 

  const handleWishlistChange = async (courseId: string, isRemoving: boolean, userId: string) => {
    if (!isAuth) {
      dispatch(openAuthModal());
      return;
    }

    try {
      if (isRemoving) {
        await deleteWishlist({ courseId, userId }).unwrap();
        notification.success({
          message: 'Removed from Wishlist',
          description: `The course has been removed from your wishlist.`
        });
      } else {
        await createWishlist({ courseId, userId }).unwrap();
        notification.success({
          message: 'Added to Wishlist',
          description: `The course has been added to your wishlist.`
        });
      }
    } catch {
      notification.error({
        message: 'Error Changing Wishlist',
        description: `An error occurred while changing your wishlist.`
      });
    }
  };

  const handleWishlistClick = () => {
    handleWishlistChange(courseId || '', isCourseInWishlist, userId || '').catch(console.error);
  };

  const increaseView = async () => {
    try {
      if (!courseId) {
        console.error('Course ID is undefined');
        return;
      }

      await increaseCourseView(courseId);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error increasing course view:', error);
    }
  };

  useEffect(() => {
    const increaseViewIfNeeded = async () => {
      try {
        if (!courseId) {
          console.error('Course ID is undefined');
          return;
        }

        const viewedCourses = sessionStorage.getItem('viewedCourses');
        if (!viewedCourses || !viewedCourses.includes(courseId)) {
          await increaseCourseView(courseId);
          sessionStorage.setItem('viewedCourses', viewedCourses ? `${viewedCourses},${courseId}` : courseId);
        }
      } catch (error) {
        console.error('Error increasing course view:', error);
      }
    };

    increaseViewIfNeeded().catch((error) => console.error('Error in increaseView:', error));
  }, [courseId, increaseCourseView]);

  const [createOrder, createOrderResult] = useCreateOrderMutation();
  const navigate = useNavigate();
  // console.log('Data course:' , courseData);
  let courseDetail = initCourseDetail;

  if (data && data.course.createdAt) {
    courseDetail = {
      ...data.course,
      _id: data.course._id ?? '',
      createdAt: data.course.createdAt,
      userId: data.course.userId ?? { _id: '', name: '', avatar: '' },
      authorId: data.course.authorId ?? { _id: '', name: '', avatar: '', biography: '' },
      views: data.course.views ?? 0 
    };
  }

  const {
    name,
    description,
    price,
    finalPrice,
    thumbnail,
    userId: author,
    authorId,
    numOfReviews,
    totalVideosLength,
    sections,
    lessons,
    avgRatingStars,
    students,
    isBought,
    updatedAt,
    views
  } = courseDetail;

  let thumbnailUrl = '';
  if (thumbnail.startsWith('https')) {
    thumbnailUrl = thumbnail;
  } else {
    thumbnailUrl = `${BACKEND_URL}/${thumbnail}`;
  }

  const { data: sectionData } = useGetSectionsByCourseIdQuery(courseId || '');

  const numOfSections = sectionData?.sections.length || 0;

  const overviewData = [
    `${formatVideoLengthToHours(totalVideosLength)} ${t('coursedetail.video')}`, // on-demand video
    `${sections} ${t('coursedetail.articles')}`
  ];

  const addCartHandler = () => {
    dispatch(addToCart(courseId as string));
  };

  const subscribeCourseHandler = () => {
    if (isAuth) {
      const orderItem = {
        courseId: courseId as string,
        name: name,
        thumbnail: thumbnail,
        finalPrice: finalPrice
      };

      const newOrder: Omit<IOrder, '_id'> = {
        items: [orderItem],
        user: {
          _id: userId,
          email: userData?.user.email || '',
          name: userData?.user.name || '',
          phone: userData?.user.phone || '',
          avatar: (userData?.user.avatar as string) || ''
        },
        transaction: {
          method: 'VNPAY'
        },
        totalPrice: 0,
        vatFee: 0,
        note: 'ENROLL COURSE FREE'
      };
      
      createOrder(newOrder)
        .unwrap()
        .then((result) => {
          console.log(result);

          navigate(`/cart/subscribe/course/${orderItem.courseId}`);
          notification.success({
            message: 'Enroll course successfully'
          });
        })
        .catch((error) => {
          console.log('error: ', error);
        });

    } else {
      notification.error({
        message: 'Please login to enroll this course'
      });

      dispatch(openAuthModal());
    }
  };

  const buyNowHandler = () => {
    const saveCourseToSessionStorage = (courseId: string) => {
      sessionStorage.removeItem('selectedCourse');
      sessionStorage.setItem('selectedCourse', courseId);
    };

    if (isAuth && courseId) {
      saveCourseToSessionStorage(courseId);
      navigate(`/checkout`);
    } else {
      notification.error({
        message: 'Please login to buy this course'
      });

      dispatch(openAuthModal());
    }
  };

  const gotoCourseHandler = () => {
    navigate(`/path-player?courseId=${courseId as string}`);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOpenPreviewModal = () => {
    setIsPreviewModalVisible(true);
  };

  const handleCancelPreviewModal = () => {
    setIsPreviewModalVisible(false);
  };

  const loadMoreCourseData = () => {
    setVisibleCourseData((prevVisibleCourseData) => prevVisibleCourseData + 5);
  };

  const truncatedCourseData = courseData.slice(0, visibleCourseData);

  const showLoadMoreButton = courseData.length > visibleCourseData;

  if (isFetching) {
    return (
      <>
        <Skeleton.Button size='large' />
        <Skeleton.Button size='large' />
        <Skeleton.Button size='large' />
      </>
    );
  }

  //const { t, i18n } = useTranslation('coursedetail');

  return (
    <div className='course-detail'>
      <div className='course-detail__wrap'>
        <div className='course-detail__intro '>
          <div className='container'>
            <div className='course-detail__intro-wrap'>
              <div className='course-detail__intro-wrap-content'>

                <h2 className='course-detail__title'>{name}</h2>
                <p className='course-detail__sub-title'>{description}</p>
                <div className='course-detail__info'>
                  {/* <div className='course-detail__info-item course-detail__info-status'>Bestseller</div> */}
                  <div className='course-detail__info-item course-detail__info-rating'>
                    <Space>
                      <span>{avgRatingStars.toFixed(1)}</span>
                      <span>
                        <StarFilled className='rating-icon' />
                        <StarFilled className='rating-icon' />
                        <StarFilled className='rating-icon' />
                        <StarFilled className='rating-icon' />
                        <StarFilled className='rating-icon' />
                      </span>
                      <span onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
                        ({numOfReviews} {t('coursedetail.rating')})
                        {/* ratings */}
                      </span>
                    </Space>
                  </div>
                  <ReviewModal courseId={courseId} visible={isModalVisible} onCancel={handleCancel} />
                  <div className='course-detail__info-item course-detail__info-students'>
                    <Space>
                      <span>{students}</span>
                      <span>{t('coursedetail.students')}</span>
                        {/* students */}
                    </Space>
                  </div>
                  <div className='course-detail__info-item course-detail__info-views'>
                    <Space>
                      <span>{views}</span>
                      <span>{t('coursedetail.views')}</span>
                      {/* views */}
                    </Space>
                  </div>
                </div>
                <div className='course-detail__intro-author'>
                  <span className=''>{t('coursedetail.created')}</span>
                  {/* Created by */}
                  <Link to={`/user/${authorId?._id}`} className='course-detail__intro-author-name'>
                    {authorId?.name}
                  </Link>
                </div>
                <div className='course-detail__intro-updated-at'>{t('coursedetail.updated')} {transformDate(updatedAt)}</div>
              {/* Last updated */}
              </div>
              <div className='course-detail__intro-wrap-course'>
                <div className='course-detail__overview'>
                  <div className='course-detail__thumbnail'>
                    <img
                      src={thumbnailUrl || 'https://res.cloudinary.com/dmj8bakoc/image/upload/v1733602406/rskfcholkailqvjcdtt0.png'}
                      alt=''
                      className='course-detail__thumbnail-img'
                    />
                    {/* <div onClick={handleOpenPreviewModal} className='course-detail__thumbnail-overlay'>
                      <RightCircleFilled className='course-detail__thumbnail-overlay-icon' />
                      <div className='course-detail__thumbnail-overlay-text'>
                        <span>Preview this course</span>
                      </div>
                    </div> */}
                    <PreviewModal
                      courseId={courseId}
                      lessonId={undefined}
                      courseName={name}
                      visible={isPreviewModalVisible}
                      onCancel={handleCancelPreviewModal}
                    />
                  </div>
                  <div className='course-detail__overview-content '>
                    <div className='course-detail__overview-price'>{finalPrice === 0 && 'FREE'}</div>
                    {finalPrice !== 0 && !isBought && (
                      <div className='course-detail__overview-price'>
                        <div>
                          <s className='font-light mr-4'>${price}</s> ${finalPrice}
                        </div>
                      </div>
                    )}
                    <div className='course-detail__overview-btns'>
                      {!isBought && (
                        <>
                          <Space>
                            {finalPrice !== 0 && (
                              <ButtonCmp
                                onClick={addCartHandler}
                                className='course-detail__overview-add-to-cart btn btn-md btn-secondary'
                              >
                                {t('coursedetail.addcart')}
                                {/* Add to Cart */}
                              </ButtonCmp>
                            )}
                            <Button className='course-detail__overview-wishlist-btn' onClick={handleWishlistClick}>
                              {isCourseInWishlist ? <HeartFilled /> : <HeartOutlined />}
                            </Button>
                          </Space>
                          <div>
                            <Space>
                              {finalPrice === 0 && (
                                <ButtonCmp
                                  onClick={subscribeCourseHandler}
                                  className='course-detail__overview-enroll-btn btn btn-md btn-primary'
                                >
                                  {t('coursedetail.enroll')}
                                  {/* Enroll now */}
                                </ButtonCmp>
                              )}
                              {finalPrice !== 0 && (
                                <ButtonCmp
                                  onClick={buyNowHandler}
                                  className='course-detail__overview-enroll-btn btn btn-md btn-primary'
                                >
                                  {t('coursedetail.buy')}
                                  {/* Buy now */}
                                </ButtonCmp>
                              )}
                            </Space>
                          </div>
                        </>
                      )}

                      {isBought && (
                        <Space>
                          <ButtonCmp onClick={gotoCourseHandler} className='btn btn-primary btn-md btn-tertiary'>
                          {t('coursedetail.gotocourse')}
                            {/* Go to course */}
                          </ButtonCmp>
                        </Space>
                      )}

                      <div className='course-detail__overview-guarantee'>{t('coursedetail.30day')}</div>
                    {/* 30-Day Money-Back Guarantee */}
                    </div>
                    <div className='course-detail__overview-includes'>
                      <h4 className='course-detail__overview-includes-title'>{t('coursedetail.courseinclude')}</h4>
                      {/* This course includes: */}
                      <List
                        dataSource={overviewData}
                        renderItem={(item, index) => (
                          <List.Item>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {index === 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px', color: '#000000', marginRight: '8px' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px', color: '#000000', marginRight: '8px' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                              )}
                              <span>{item}</span>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='course-detail__includes'>
            <div className='course-detail__includes-list'>
              <div className='course-detail__includes-item spacing-h-sm'>
                <div className='container course-detail__includes-wrap '>
                  <List
                    header={<div className='course-detail__includes-header'>{t('coursedetail.learn')}</div>} // What you'll learn
                    dataSource={truncatedCourseData}
                    renderItem={(item) => (
                      <List.Item>
                        <Space>
                          <Typography.Text>
                            <CheckOutlined />
                          </Typography.Text>
                          <span>{item}</span>
                        </Space>
                      </List.Item>
                    )}
                  />
                  {showLoadMoreButton && (
                    <Button
                      className='course-detail__includes-footer'
                      style={{ marginBottom: '20px' }}
                      onClick={loadMoreCourseData}
                    >
                      {t('coursedetail.show')}
                      {/* Show more */}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='course-detail__content spacing-h-sm'>
            <div className='course-detail__content-list'>
              <div className='course-detail__content-item'>
                <h3 className='course-detail__content-title'>{t('coursedetail.coursecontent')}</h3> {/* Course content */}
                <div className='course-detail__content-wrap'>
                  <div className='course-detail__content-summary'>
                    <Row className='course-detail__content-summary-row'>
                      <Col md='12'>
                      {numOfSections} {t('coursedetail.sections')} • {lessons} {t('coursedetail.lectures')} • {formatVideoLengthToHours(totalVideosLength)}{' '}
                      {t('coursedetail.length')}
                        {/* {numOfSections} sections • {lessons} lectures • {formatVideoLengthToHours(totalVideosLength)}{' '}
                        total length */}
                      </Col>
                      <Col className='course-detail__content-summary-col col-right' md='12'>
                      <Link to='/'>{t('coursedetail.expand')}</Link>
                        {/* <Link to='/'>Expand all sections</Link> */}
                      </Col>
                    </Row>
                  </div>
                </div>
                {courseId && <SectionList courseId={courseId} courseName={name} />}
              </div>
            </div>
          </div>
          <div className='course-detail__related-courses'>
            {courseId !== undefined && <RelatedCourses courseId={courseId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
