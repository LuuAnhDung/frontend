import { FacebookFilled, LinkedinFilled, TwitterOutlined, YoutubeFilled } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import './Footer.scss';
import { useTranslation } from 'react-i18next';


const Footer = () => {
  const { t, i18n } = useTranslation('footer');
  return (
    <div className='footer'>
      <div className='container'>
        <Row className='footer__row' justify='space-between'>
          <Col md={8} xs={24} sm={12}>
            <div className='footer__col'>
              <div className='footer__logo'>
                <img
                  src='https://imgur.com/TCagADN.png'
                  alt='Logo'
                  className='footer__logo-img w-64 h-auto'
                />
              </div>
              <p className='footer__text'>
                {/* Welcome to EduCo_, where brilliance meets innovation!  */}
              </p>
            </div>
          </Col>

          <Col md={8} xs={24} sm={12}>
            <div className='footer__col-link'>
              <h3 className='footer__title'>
              {t('footer.dis')}
                {/* Discovery EduCo_ */}
              </h3>
              <Row gutter={[16, 16]}>
                <Col sm={12} md={12}>
                  <ul className='featured-list'>
                    <li className='featured-list__item'>
                      <Link className='featured-list__item-link' to='/'>
                      {t('footer.home')}
                        {/* Home */}
                      </Link>
                    </li>
                    <li className='featured-list__item'>
                      <Link className='featured-list__item-link' to='/courses'>
                      {t('footer.courses')}
                        {/* Courses */}
                      </Link>
                    </li>
                    <li className='featured-list__item'>
                      <Link className='featured-list__item-link' to='/about-us'>
                      {t('footer.aboutus')}
                        {/* About Us */}
                      </Link>
                    </li>
                  </ul>
                </Col>
                <Col sm={12} md={12}>
                  <ul className='featured-list'>
                    <li className='featured-list__item'>
                      <Link className='featured-list__item-link' to='/contact'>
                      {t('footer.contact')}
                        {/* Contact Us */}
                      </Link>
                    </li>
                    <li className='featured-list__item'>
                      <Link className='featured-list__item-link' to='/'>
                      {t('footer.teach')}
                        {/* Teach on EduCo_ */}
                      </Link>
                    </li>
                    <li className='featured-list__item'>
                      <Link className='featured-list__item-link' to='/'>
                      {t('footer.help')}
                        {/* Help and Support */}
                      </Link>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </Col>

          <Col md={8} xs={24} sm={12}>
            <div className='footer__col-media'>
              <h3 className='footer__title'>
              {t('footer.media')}
                {/* Social Media */}
                </h3>
              <div className='social-list'>
                <a href='https://www.facebook.com' title='facebook' className='social-btn'>
                  <FacebookFilled className='social-icon' />
                </a>
                <a href='https://twitter.com' title='twitter' className='social-btn'>
                  <TwitterOutlined className='social-icon' />
                </a>
                <a href='https://www.linkedin.com' title='linkedin' className='social-btn'>
                  <LinkedinFilled className='social-icon' />
                </a>
                <a href='https://www.youtube.com' title='youtube' className='social-btn'>
                  <YoutubeFilled className='social-icon' />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;