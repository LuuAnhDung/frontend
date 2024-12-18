import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';

interface ErrorProps {
  page: string;
}

export default function ErrorPage(props: ErrorProps) {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
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
  );
}
