import { BellOutlined, HeartOutlined, SettingOutlined, HistoryOutlined, LogoutOutlined ,MenuOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Badge, Drawer, Dropdown, Input, Modal, Space, notification } from 'antd';
import { useEffect, useState, useMemo, RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLogoutMutation } from '../../../pages/auth.service';
import { closeAuthModal, openAuthModal, resetAuthState, setUnauthenticated } from '../../../pages/auth.slice';
import Login from '../../../pages/site/Auth/Login';
import Signup from '../../../pages/site/Auth/Signup';
import { useGetUserQuery } from '../../../pages/site/client.service';
import { setSearchQuery } from '../../../pages/site/client.slice';
import { RootState } from '../../../store/store';
import { IUser } from '../../../types/user.type';
import Button from '../../Button';
import Forgot from '../../../pages/site/Auth/Forgot';
import ChangePassword from '../../../pages/site/Auth/ChangePassword';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../../constant/backend-domain';
import React, { useRef } from 'react';
const { Search } = Input;
import './Header.scss';
import { useTranslation } from 'react-i18next';


const Header = () => {
  // State here
  const [showCategoriesNav, setShowCategoriesNav] = useState(true);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const isOpenAuthModal = useSelector((state: RootState) => state.auth.isOpenAuthModal);
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const [authState, setAuthState] = useState('login');
  const cart = useSelector((state: RootState) => state.client.cart);
  const authStateGlobal = useSelector((state: RootState) => state.auth.authState);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [userData, setUserData] = useState<IUser>();
  const { data } = useGetUserQuery(userId, {
    skip: !userId
  });
  const [logout, logoutResult] = useLogoutMutation();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPath = location.pathname;
  
  // useMemo(() => {
  //   const socket = io(`${BACKEND_URL}`);
  //   socket.on('login', (data: any) => {
  //     console.log(data);
  //   });
  // }, []);

  ///////////////////////////////////
  const { t, i18n } = useTranslation('header');
  const [currentLang, setCurrentLang] = useState('en'); // Ngôn ngữ hiện tại
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: 'en',
      flag: 'https://res.cloudinary.com/dmj8bakoc/image/upload/v1734192856/flag_pkmyx6.png', // Đường link tới cờ USA
    },
    {
      code: 'vi',
      flag: 'https://res.cloudinary.com/dmj8bakoc/image/upload/v1734192547/vietnam_rda60a.png', // Đường link tới cờ Việt Nam
    },
  ];

  // Thay đổi ngôn ngữ
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode); // Đổi ngôn ngữ trong react-i18next
    setCurrentLang(langCode); 
    setIsOpen(false);
  };
  /////////

  useEffect(() => {
    if (data) {
      setUserData(data.user);
    }
  }, [data]);

  useEffect(() => {
    console.log('authStateGlobal', authStateGlobal);
  }, [authStateGlobal]);

  const menuRef = useRef<HTMLDivElement>(null);
  const menubtnRef = useRef<HTMLSpanElement>(null);
  const closebtnRef = useRef<HTMLSpanElement>(null);

  const openMenu = () => {
    if (menuRef.current && menubtnRef.current && closebtnRef.current) {
      menuRef.current.style.display = 'block';
      menubtnRef.current.style.display = 'none';
      closebtnRef.current.style.display = 'block';
      // overlayRef.current.style.display = 'none';
    }
  };

  const closeMenu = () => {
    if (menubtnRef.current && closebtnRef.current && menuRef.current) {
      menubtnRef.current.style.display = 'block';
      closebtnRef.current.style.display = 'none';
      menuRef.current.style.display = 'none';
      // overlayRef.current.style.display = 'block';
    }
  };
  const userAuthItems: MenuProps['items'] = [
    {
      label: (
        <Link to='/profile'>
          <div>{userData?.name}</div>
          <div>{userData?.email}</div>
        </Link>
      ),
      key: 'profile',
      icon: <Avatar src={userData?.avatar as string} />
    },
    {
      label: <Link to='/start'>{t('header.mylearning')}</Link>,  //My Learning
      key: 'mylearning',
      icon: <MenuOutlined />
    },
    // {
    //   label: 'Notifications',
    //   key: 'notifications',
    //   icon: <UserOutlined />
    // },
    {
      label: (
        <Link to='/account-settings'>
          <div>{t('header.setting')}</div>  {/* Account settings */}
        </Link>
      ),
      key: 'account-settings',
      icon: <SettingOutlined />
    },
    {
      label: (
        <Link to='/purchase-history'>
          <div>{t('header.purchase')}</div> {/* Purchase history */}
        </Link>
      ),
      key: 'purchase-history',
      icon: <HistoryOutlined />
    },
    // {
    //   label: 'Public Profile',
    //   key: 'public-profile',
    //   icon: <UserOutlined />
    // },
    {
      label: (
        <Link to='/change-password'>
          <div>{t('header.change')}</div> {/* Change Password */}
        </Link>
      ),
      key: 'change-password',
      icon: <UserOutlined />
    },
  
    {
      label: t('header.logout'), //'Logout'
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true
      // disabled: true
    }
  ];

  const notificationItems: MenuProps['items'] = [];

  const wishlistItems: MenuProps['items'] = [
    {
      label: (
        <Link to='/wishlist'>
          <div>Wishlist</div>
        </Link>
      ),
      key: 'wishlist',
      icon: <UserOutlined />
    }
  ];

  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(resetAuthState());
    dispatch(closeAuthModal());
  };

  const handleCancel = () => {
    dispatch(resetAuthState());
    dispatch(closeAuthModal());
  };

  const signInHandler = () => {
    setAuthState('login');
    dispatch(openAuthModal());
  };

  const signUpHandler = () => {
    setAuthState('signup');
    dispatch(openAuthModal());
  };

  const changeAuthState = (authState: string) => {
    setAuthState(authState);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      logout()
        .unwrap()
        .then((result) => {
          notification.success({
            message: result.message
          });
        })
        .catch((error) => {
          console.log('error: ', error);
        });
      dispatch(setUnauthenticated());
    }
  };

  const menuUserProps = {
    items: userAuthItems,
    onClick: handleMenuClick
  };
  const menuNotificationsProps = {
    items: notificationItems,
    onClick: handleMenuClick
  };
  const menuWishlistProps = {
    items: wishlistItems,
    onClick: handleMenuClick
  };

  const onSearch = (value: string) => {
    dispatch(setSearchQuery(value));
    setSearchParams({ _q: value });
    navigate(`courses?_q=${value}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowCategoriesNav(false);
      } else {
        setShowCategoriesNav(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onCloseMobileMenu = () => {
    setOpenMobileMenu(false);
  };

  const showMobileMenuHandler = () => {
    setOpenMobileMenu(true);
  };


  return (
    <div className='header'>
      <div className="language-switcher">
        {/* Nút chính */}
        <button
          className="language-switcher__button"
          style={{
            backgroundImage: `url(${
              languages.find((lang) => lang.code === currentLang)?.flag
            })`,
          }}
          onClick={() => setIsOpen(!isOpen)}
        ></button>

        {/* Dropdown danh sách cờ */}
        {isOpen && (
          <div className="language-switcher__dropdown">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="language-switcher__dropdown__item"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <img src={lang.flag} alt={`Flag of ${lang.code}`} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className='container'>
        <div className='header__wrapper '>
          {/* <MenuOutlined onClick={showMobileMenuHandler} className='header__menu-mobile font-bold lg:hidden' /> */}
          <Link to='/' className='header__logo'>
            <img src='https://imgur.com/JSfQPVT.png' alt='' className='header__logo-img w-64 h-auto' />
          </Link>

          <div className='header__nav'>
            <ul id='menu' className='header__nav-list' ref={menuRef as unknown as RefObject<HTMLUListElement>}>
              <Link to='/' className='header__logo header__logo-mobile'>
                <img src='https://imgur.com/JSfQPVT.png' alt='' className='header__logo-img w-64 h-auto' />
              </Link>
              {isAuth && (
                <li className='header__nav-item'>
                  <Link to='/start' className='header__nav-link hover:opacity-70'>
                    {t('header.mylearning')}
                    {/* My Learning */}
                  </Link>
                </li>
              )}
              <li className='header__nav-item'>
                <Link to='/' className='header__nav-link hover:opacity-70'>
                  {t('header.home')}
                  {/* Home */}
                </Link>
              </li>
              <li className='header__nav-item '>
                <Link to='/courses' className='header__nav-link hover:opacity-70'>
                {t('header.courses')}
                {/* Courses */}
                </Link>
              </li>
              <li className='header__nav-item'>
                <Link to='/contact' className='header__nav-link hover:opacity-70'>
                {t('header.contact')}
                {/* Contact */}
                </Link>
              </li>
              <li className='header__nav-item'>
                <Link to='/about-us' className='header__nav-link hover:opacity-70'>
                {t('header.aboutus')}
                  {/* About us */}
                </Link>
              </li>
              <li className='header__nav-item'>
                <Link to='/blog' className='block hover:opacity-70'>
                  Blog
                </Link>
              </li>
          
              {/* <div className='overlay'></div> */}

              <div className='header__auth header__auth-mobile'>
                {!isAuth && (
                  <Space className='item'>
                    <Button onClick={signInHandler} className='btn btn-sm'>
                    {t('header.signin')}
                      {/* Sign in */}
                    </Button>
                    <Button onClick={signUpHandler} className='btn btn-sm btn-outline-primary'>
                    {t('header.signup')}
                      {/* Sign up */}
                    </Button>
                  </Space>
                )}
              </div>

            </ul>
            <div className='header-icon'>
              <div className='header__search'>
                <Search
                  style={{ width: '30rem' }}
                  placeholder='Search to find your suitable courses'
                  onSearch={onSearch}
                  enterButton
                />
              </div>

              <div className='header__search-mobile'>
                <div className='icon-search'>
                  <svg
                    viewBox='64 64 896 896'
                    focusable='false'
                    data-icon='search'
                    width='1em'
                    height='1em'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <path d='M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'></path>
                  </svg>
                  <input
                    className='input'
                    type='search'
                    name=''
                    id=''
                    placeholder='Search to find your suitable courses...'
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                      if (event.key === 'Enter') {
                        onSearch(event.currentTarget.value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className='header__nav-item header__nav-item--cart'>
                <Link className='header__nav-link' to='/view-cart'>
                  <Badge count={cart?.items?.length || 0}>
                    <ShoppingCartOutlined className='header__nav-link-icon' />
                  </Badge>
                </Link>
              </div>
              {isAuth && (
                <li className='header__nav-item'>
                  <Dropdown menu={menuWishlistProps} placement='bottomRight'>
                    <Badge dot={true}>
                      <HeartOutlined
                        className='header__nav-item-user-icon header__nav-link-icon'
                        style={{ cursor: 'pointer' }}
                      />
                    </Badge>
                  </Dropdown>
                </li>
              )}

              {isAuth && (
                <li className='header__nav-item'>
                  <Dropdown menu={menuNotificationsProps} placement='bottomRight'>
                    <Badge dot={true}>
                      <BellOutlined
                        className='header__nav-item-notify-icon header__nav-link-icon'
                        style={{ cursor: 'pointer' }}
                      />
                    </Badge>
                  </Dropdown>
                </li>
              )}
              {isAuth && (
                <div className='header__nav-item header__nav-item--user'>
                  <Dropdown menu={menuUserProps} placement='bottomRight'>
                    <Badge dot={true}>
                      <Avatar className='header__nav-item-user-icon' src={userData?.avatar as string} />
                    </Badge>
                  </Dropdown>
                </div>
              )}
              <div className='header__auth'>
                {!isAuth && (
                  <Space>
                    <Button onClick={signInHandler} className='btn btn-sm'>
                    {t('header.signin')}
                      {/* Sign in */}
                    </Button>
                    <Button onClick={signUpHandler} className='btn btn-sm btn-outline-primary'>
                    {t('header.signup')}
                      {/* Sign up */}
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          </div>
          <span className='menubtn' onClick={openMenu} ref={menubtnRef}>
            &#9776;
          </span>
          <span className='closebtn' onClick={closeMenu} ref={closebtnRef}>
            &#9746;
          </span>
        </div>

      </div>
      {/* {currentPath === '/' && showCategoriesNav && <CategoriesNav />} */}
      <Modal title='' open={isOpenAuthModal} onOk={handleOk} onCancel={handleCancel}>
        {authState === 'login' && <Login onClick={changeAuthState} />}
        {authState === 'signup' && <Signup onClick={changeAuthState} />}
        {authState === 'forgot' && <Forgot onClick={changeAuthState} />}
        {authStateGlobal === 'changePassword' && <ChangePassword onClick={changeAuthState} />}
      </Modal>

      <Drawer
        title='Mobile menu'
        placement={'left'}
        width={300}
        onClose={onCloseMobileMenu}
        open={openMobileMenu}
        extra={
          <Space>
            <Button onClick={onCloseMobileMenu}>Cancel</Button>
            <Button onClick={onCloseMobileMenu}>OK</Button>
          </Space>
        }
      >
        <div>Content in here</div>
      </Drawer>
    </div>
  );
};

export default Header;
