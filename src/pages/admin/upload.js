import UploadCSV from '../components/UploadCSV';
import Navigation from '../components/navigation';
import { parseCookies } from 'nookies';

const Upload = () => {

  return (
    <Navigation>
      <UploadCSV />
    </Navigation>
  );
};

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  
  // Check if the token exists in the cookies
  if (!cookies.authToken) {
    // Redirect to login page if no token found
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  // If token exists, render the page
  return {
    props: {}, // You can pass additional props if needed
  };
}

export default Upload;
