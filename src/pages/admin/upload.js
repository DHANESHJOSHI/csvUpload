import Layout from '../components/Layout';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import UploadCSV from '../components/UploadCSV';

const Upload = () => {

  return (
    <Layout>
      <UploadCSV />
    </Layout>
  );
};



export default Upload;
