import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { JobList } from './JobList';
const { loadJobsQuery, loadJobs } = require('./requests');

export function JobBoard() {
  const { data, loading, error } = useQuery(loadJobsQuery);
  // const [jobs, setJobs] = React.useState([]);

  // React.useEffect(() => {
  //   loadJobs().then((jobs) => {
  //     setJobs(jobs);
  //   });
  // }, []);

  // React.useEffect(() => {
  //   (async () => {
  //     const jobs = await loadJobs();
  //     setJobs(jobs);
  //   })();
  // }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>ERROR!</div>;

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={data.jobs} />
    </div>
  );
}
