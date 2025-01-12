import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; 
import Layout from '../components/Layout';
import UsersTable from '../components/usersTable';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import Custom404 from '../404'; // 

const Scholarships = () => {


  return (
    <Layout>
      <UsersTable />
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

export default Scholarships;
