import { parseCookies } from 'nookies';

import Dash from '../components/dashboard';
import Navigation from '../components/navigation';

const Dashboard = () => {

  return (
    <Navigation>
      <Dash />
    </Navigation>
  );
};

// Server-side authentication check
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

export default Dashboard;
