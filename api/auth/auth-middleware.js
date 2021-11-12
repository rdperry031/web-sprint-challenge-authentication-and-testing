const Users = require('../users/users-model');

const checkUsernameAvailable = async (req, res, next) => {
  try {
    const { username } = req.body;
    const [user] = await Users.findBy({ username });
    if (user) {
      next({ status: 403, message: 'Username taken' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const validateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      next({ status: 400, message: 'username and password are required' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const checkUsernameExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const [user] = await Users.findBy({ username });
    if (!user) {
      next({ status: 401, message: 'Invalid credentials' });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next();
  }
};
module.exports = {
  checkUsernameAvailable,
  validateUser,
  checkUsernameExists,
};
