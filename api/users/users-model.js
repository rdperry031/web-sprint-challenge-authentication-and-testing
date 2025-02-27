const db = require('../../data/dbConfig');

function find() {
  return db('users');
}

function findById(id) {
  return db('users').where({ id }).first();
}

function findBy(filter) {
  return db('users').where(filter);
}

async function add(user) {
  const [id] = await db('users').insert(user);
  const newUser = await db('users').where({ id }).first();
  return newUser;
}

module.exports = {
  find,
  findById,
  add,
  findBy,
};
