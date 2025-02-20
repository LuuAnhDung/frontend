import { Col, Row, Tabs, TabsProps } from 'antd';
import './Profile.scss';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
// type Props = {}
import { ReadOutlined, StockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/Button';
import { RootState } from '../../../store/store';
import { formatVideoLengthToHours } from '../../../utils/functions';
import { useGetUserDetailQuery } from '../client.service';
import { useTranslation } from 'react-i18next';

interface AchievementData {
  image: string;
  text: string;
}


const profileItems: TabsProps['items'] = [
  {
    key: 'about',
    label: (
      <div className='tab-item'>
        <p className='tab-item__text'>
          <UserOutlined className='tab-item__icon' />
        </p>
        <p>About</p>
      </div>
    ),
    children: ``
  }
];

const tabBarStyleCss = {
  padding: '2rem',
  fontSize: '2.4rem',
  bacgroundColor: '#194583'
};

const Profile = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const {t, i18n} = useTranslation('profile');

  const params = {
    _userId: userId,
    _limit: 12,
    _page: 1
  };

  const { data, isFetching } = useGetUserDetailQuery(params, {
    skip: !userId
  });

  const achievements: Record<string, AchievementData> = {
    Newbie: {
      image: 'https://lwfiles.mycourse.app/65ac73296e5c564383a8e28b-public/badges/newbie.png',
      text: 'Newbie'
    },
    Intermediate: {
      image: 'https://thumb.ac-illust.com/d9/d9577885428afb171e9d09dad899ee1e_t.jpeg',
      text: 'Intermediate'
    },
    Excellence: {
      image: 'https://thumbs.dreamstime.com/b/print-235466646.jpg',
      text: 'Excellence'
    },
    Legend: {
      image:
        'https://static.vecteezy.com/system/resources/previews/033/507/252/non_2x/dragon-cartoon-illustration-isolated-on-white-background-cute-dragon-icon-vector.jpg',
      text: 'Legend'
    }
  };

  const [achievementData, setAchievementData]: [AchievementData[], Dispatch<SetStateAction<AchievementData[]>>] =
    useState<AchievementData[]>([]);

  useEffect(() => {
    if (data && data.user && data.user.achievement) {
      const achievedLevel = data.user.achievement;
      const levels = Object.keys(achievements);

      const achievedLevels = levels.filter((level) => levels.indexOf(level) <= levels.indexOf(achievedLevel));
      const achievedData: AchievementData[] = achievedLevels.map((level) => achievements[level]);

      setAchievementData(achievedData);
    }
  }, [data]);

  const sumTotalVideosLengthDone = data?.user.courses.reduce((acc, course) => {
    return acc + course.totalVideosLengthDone;
  }, 0);

  const onChange = (key: string) => {
    console.log(key);
  };


  return (
    <div className='profile'>
      <div className='profile__wrap '>
        <div className='container'>
          <div className='profile__header'>
            <div className=' profile__header-wrap'>
              <Row className='row-wrap'>
                <Col className='col'>
                  <div className='profile__header-item'>
                    <div className='profile__header-item-icon'>
                      <ReadOutlined />
                    </div>
                    <div className='profile__header-item-number'>{data?.user.courses.length}</div>
                    <div className='profile__header-item-text'>{t('profile.courses')}</div> {/* Courses */}
                  </div>
                </Col>
                <Col className='col'>
                  <div className='profile__header-item'>
                    <div className='profile__header-item-icon'>
                      <ReadOutlined />
                    </div>
                    <div className='profile__header-item-number'>
                      {formatVideoLengthToHours(sumTotalVideosLengthDone || 0)}
                    </div>
                    <div className='profile__header-item-text'>{t('profile.hours')}</div>{/* Hours */}
                  </div>
                </Col>
                <Col className='col col-wrap'>
                  <div className='profile__header-item'>
                    <div className='profile__header-item-icon'>
                      <img
                        src={typeof data?.user.avatar === 'string' ? data.user.avatar : undefined}
                        alt=''
                        className='profile__header-item-img'
                      />
                    </div>
                    <div className='profile__header-item-name'>
                      <div className='profile__header-item-name-text'>{data?.user.name}</div>
                      <div className='profile__header-item-name-badge'>{data?.user.role}</div>
                    </div>
                    <div className='profile__header-item-btn-wrap'>
                      <Link
                        to='/account-settings'
                      >
                        <Button className=' profile__header-item-btn btn btn-sm btn-primary'>{t('profile.edit')}</Button> {/* Edit */}
                      </Link>
                    </div>
                  </div>
                </Col>
                <Col className='col'>
                  <div className='profile__header-item'>
                    <div className='profile__header-item-icon'>
                      <ReadOutlined />
                    </div>
                    <div className='profile__header-item-number'>0</div>
                    <div className='profile__header-item-text'>{t('profile.posts')}</div>
                  </div>
                </Col>
                <Col className='col'>
                  <div className='profile__header-item'>
                    <div className='profile__header-item-icon'>
                      <ReadOutlined />
                    </div>
                    <div className='profile__header-item-number'>{data?.user.numCourses ?? 0}</div>
                    <div className='profile__header-item-text'>{t('profile.achievement')}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className='profile__tabs'>
            <Tabs
              tabBarStyle={tabBarStyleCss}
              className='profile__tabs-bar'
              defaultActiveKey='1'
              items={profileItems}
              onChange={onChange}
              centered
            />
          </div>

          <div className='profile__courses-taken'>
            <div className='profile__courses-taken-list'>
              <Row>
                <Col></Col>
              </Row>
            </div>
          </div>
          <div className='profile__networks'>
            <div className='profile__followers'></div>
            <div className='profile__followings'></div>
          </div>
        </div>
      </div>
      <div className='profile__info'>
        <div className='container'>
          <div className='profile-achievements'>
           <div className='profile-achievements-tt'>{t('profile.achievement')}</div> {/* ACHIEVEMENTS */}
            <div className='profile-achievements-list'>
              <div className='profile-achievements-item'>
                {achievementData.map((achievement, index) => (
                  <div key={index} className='level'>
                    <div className='level-img'>
                      <img src={achievement.image} alt='' style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </div>
                    <div className='level-text'>{achievement.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
