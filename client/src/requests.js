import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from 'apollo-boost';
import gql from 'graphql-tag';
import { getAccessToken, isLoggedIn } from './auth';

const endpoint = 'http://localhost:9000/graphql';

// operation is whatever mutation or query is bein g passed in
// forward allows us to chain multiple steps together (forward it to next step)

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return forward(operation);
});

// by adding authLInk, we set Aut Headers first before sending over request
export const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: endpoint })]),
  cache: new InMemoryCache(),
});

// async function graphqlRequest(query, variables = {}) {
//   const request = {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify({ query, variables }),
//   };
//   if (isLoggedIn()) {
//     request.headers['Authorization'] = `Bearer ${getAccessToken()}`;
//   }

//   const response = await fetch(endpoint, request);
//   const body = await response.json();
//   if (body.errors) {
//     const message = body.errors.map((error) => error.message).join('\n');
//     throw new Error(message);
//   }
//   return body.data;
// }

export const loadJobsQuery = gql`
  query {
    jobs {
      title
      id
      description
      company {
        id
        name
        description
      }
    }
  }
`;

export async function loadJobs() {
  const {
    data: { jobs },
    // apollo caches by default.
    // to always fetch fresh data for jobs list, we set no-cache
  } = await client.query({
    query: loadJobsQuery,
    fetchPolicy: 'no-cache',
  });
  return jobs;
}

export async function loadJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        title
        id
        company {
          id
          name
        }
        description
      }
    }
  `;
  const {
    data: { job },
  } = await client.query({ query, variables: { id } });
  return job;
}

export async function loadCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
      }
      jobs {
        id
        title
      }
    }
  `;
  const {
    data: { company },
  } = await client.query({ query, variables: { id } });
  return company;
}

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      id
      title
      company {
        id
        name
      }
    }
  }
`;

// export async function createJob(input) {
//   const {
//     data: { job },
//   } = await client.mutate({ createJobMutation, variables: { input } });
//   return job;
// }
