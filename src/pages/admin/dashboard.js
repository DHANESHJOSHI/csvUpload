import Layout from '../components/Layout';
import Dash from '../components/dashboard';
import { withAuth } from '../lib/withAuth';

const Dashboard = () => {
  return (
    <Layout>
      <Dash />
    </Layout>
  );
};

export default withAuth(Dashboard);
