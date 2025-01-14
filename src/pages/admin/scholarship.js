import Cookies from 'js-cookie'; 
import UsersTable from '../components/usersTable';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import Custom404 from '../404'; // 
import Navigation from '../components/navigation';

const Scholarships = () => {


  return (
    <Navigation>
      <UsersTable />
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
export default Scholarships;
