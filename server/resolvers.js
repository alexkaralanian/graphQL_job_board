const db = require('./db');

const Query = {
  jobs: () => db.jobs.list(),
  job: (root, { id }) => db.jobs.get(id),
  company: (root, { id }) => db.companies.get(id),
};

const Mutation = {
  // context can be used to access ptoperties provided by app
  // for example a JWT for authentication
  // up to us to put something into context in 1st place.
  createJob: (root, { input }, context) => {
    console.log('CONTEXT', context);
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    console.log('INPUT', input);
    const id = db.jobs.create({ ...input, companyId: context.user.companyId });
    return db.jobs.get(id);
  },
};

const Job = {
  // nested relationship
  company: (job) => db.companies.get(job.companyId),
};

// May jobs associated with one company
const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

module.exports = {
  Query,
  Mutation,
  Job,
  Company,
};
