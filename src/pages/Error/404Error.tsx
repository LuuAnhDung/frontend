import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';
import './404Error.scss';
interface ErrorProps {
  page: string;
}

export default function ErrorPage(props: ErrorProps) {
  const error = useRouteError();
  const navigate = useNavigate();
  //console.error(error);
  //console.error('Error details:', error);
  if (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }
  } else {
    console.error('No error details available');
  }

  return (
    <div className='error-404 mt-md'>
      <div style={{ display: 'flex', justifyContent: 'center'}}> 
        <img src="https://res.cloudinary.com/dmj8bakoc/image/upload/v1734011601/404_Text_2_hpkxkj.png"/>
      </div>
      <Result
        status='404'
        title='Page not found'
        subTitle='Oops! The page you are looking for does not exist. It might have been moved or deleted.'
        extra={
          <Button onClick={() => navigate(`${props.page}`)} type='primary'>
            Back Home
          </Button>
        }
        className='no-icon-error'
      />
    </div>
  );
}
