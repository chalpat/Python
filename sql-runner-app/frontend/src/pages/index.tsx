import React from 'react';
import QueryRunner from '../components/QueryRunner';

const Home = () => {
  return (
    <div>
      <h1>SQL Runner</h1>
      <p>Execute your SQL queries below:</p>
      <QueryRunner />
    </div>
  );
};

export default Home;