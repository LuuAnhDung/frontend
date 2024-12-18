import './welcome.scss';
type ParamsType = {
  _q: string;
  _page: number;
  _limit: number;
  _status?: string;
};
const Welcome = () => {
  return (
    <div className='welcome'>
      <div className='welcome-header'>
        <div className='welcome-header-left'>
          <h3 className='title'>Welcome to Admin!</h3>
          <div className='desc'>
            Welcome back! Wishing you a productive and enjoyable day working on your admin website. Hope you have great
            experiences and success in all management activities.
          </div>
          <div className='heart'></div>
        </div>
      </div>

      <div className="welcome-box">
        <div className="welcome-box-img">
          <img src="https://imgur.com/0Af2gB5.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;