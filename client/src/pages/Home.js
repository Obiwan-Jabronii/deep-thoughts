import React from 'react';
import { useQuery } from '@apollo/client';
import { Query_Thoughts } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {

  // use the useQuery hook to make the query request
  const { loading, data } = useQuery(Query_Thoughts);

  const thoughts = data?.thoughts || [];
  console.log(thoughts);
  //if page is still loading then loading will be displayed 
  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Food for Thought(s)..." />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
