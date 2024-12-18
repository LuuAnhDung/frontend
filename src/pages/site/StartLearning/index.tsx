import { ReadOutlined } from '@ant-design/icons';
import { Col, Pagination, Row, Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ButtonCmp from '../../../components/Button';
import { RootState } from '../../../store/store';
import { formatVideoLengthToHours } from '../../../utils/functions';
import { useGetUserDetailQuery } from '../client.service';
import CourseList from '../components/CourseList';
import './StartLearning.scss';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// type Props = {};

const StartLearning = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [currentPage, setCurrentPage] = useState(1);

  const params = {
    _userId: userId,
    _limit: 8,
    _page: currentPage
  };

  const { data, isFetching } = useGetUserDetailQuery(params, {
    skip: !userId
  });

  const sumTotalVideosLengthDone = data?.user.courses.reduce((acc, course) => {
    return acc + course.totalVideosLengthDone;
  }, 0);

  const { t, i18n } = useTranslation('mylearn');

  return (
    <div className='start-learning'>
      <div className='start-learning__wrap'>
        <div className='container'>
          <div className='start-learning__header'>
            <Row className='start-learning__header-row'>
              <Col className='learning__col--left'>
                <div className='start-learning__header-welcome'>
                  <div className='start-learning__header-welcome-icon'>
                    <img
                      src={typeof data?.user.avatar === 'string' ? data.user.avatar : undefined}
                      alt=''
                      className='start-learning__header-welcome-img'
                    />
                  </div>
                  <div className='start-learning__header-welcome-info'>
                    <div className='start-learning__header-welcome-text'>{t('mylearn.hi')}</div>
                    <div className='start-learning__header-welcome-name'>{data?.user.name}</div>
                    <div className='start-learning__header-welcome-view-profile'>
                      <Link to='/profile'>
                        <ButtonCmp className='btn btn-sm btn-outline-primary'>{t('mylearn.visit')}</ButtonCmp>
                        {/* Visit profile */}
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className='learning__col--right'>
                <div className='start-learning__header-summary'>
                  <Row className='start-learning__header-summary-row'>
                    <Col md={8} xs={24} sm={24} className='col'>
                      <div className='start-learning__header-summary-item start-learning__header-summary-item--courses'>
                        <div className='start-learning__header-summary-item-icon'>
                          <ReadOutlined />
                        </div>
                        <div className='start-learning__header-summary-item-number'>
                          {data?.user.courses.length || 0}
                        </div>
                        <div className='start-learning__header-summary-item-text'>{t('mylearn.courses')}</div>
                        {/* Courses */}
                      </div>
                    </Col>
                    <Col md={8} xs={24} sm={24} className='col'>
                      <div className='start-learning__header-summary-item start-learning__header-summary-item--messages'>
                        <div className='start-learning__header-summary-item-icon'>
                          <ReadOutlined />
                        </div>
                        <div className='start-learning__header-summary-item-number'>0</div>
                        <div className='start-learning__header-summary-item-text'>{t('mylearn.messages')}</div>
                        {/* Messages */}
                      </div>
                    </Col>
                    <Col md={8} xs={24} sm={24} className='col'>
                      <div className='start-learning__header-summary-item start-learning__header-summary-item--hours'>
                        <div className='start-learning__header-summary-item-icon'>
                          <ReadOutlined />
                        </div>
                        <div className='start-learning__header-summary-item-number'>
                          {formatVideoLengthToHours(sumTotalVideosLengthDone || 0)}
                        </div>
                        <div className='start-learning__header-summary-item-text'>{t('mylearn.hours')}</div>
                        {/* Hours */}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>

          <div className='start-learning__courses spacing-h-md'>
            <div className='start-learning__courses-wrap container'>
              <h2 className='start-learning__courses-heading'>{t('mylearn.courses')}</h2>
                {/* Courses */}
              <div className='start-learning__courses-list'>
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <CourseList
                    courseState='ordered'
                    courses={data?.user.courses || []}
                    className='start-learning__courses-row'
                  />
                )}
                {data?.user.courses && data?.user.courses.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination current={currentPage} onChange={setCurrentPage} pageSize={8} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartLearning;
