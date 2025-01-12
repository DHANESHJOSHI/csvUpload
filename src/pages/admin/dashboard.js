import Layout from '../components/Layout';
import Dash from '../components/dashboard';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

const Dashboard = () => {
  return (
    <Layout>
      <Dash />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.authToken;

  if (!token) {
    // Redirect to login if no token
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET);
    return { props: {} }; 
  } catch (err) {
    console.error('Token verification failed:', err);
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
}

export default Dashboard;
