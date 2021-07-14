import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { createJobMutation } from './requests';

export function JobForm({ history }) {
  const [values, setValues] = React.useState({
    title: '',
    description: '',
  });

  const [createJob] = useMutation(createJobMutation);

  function handleChange({ target: { name, value } }) {
    // if you pass in a function, will return current state, which we merge into a new obj
    setValues((prevInputs) => ({ ...prevInputs, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const {
      data: { job },
    } = await createJob({
      variables: {
        input: values,
      },
    });
    console.log('JOB', job);
    history.push(`/jobs/${job.id}`);
  }

  const { title, description } = values;
  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="input"
                style={{ height: '10em' }}
                name="description"
                value={description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
