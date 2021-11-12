const router = require('express').Router();
const { BCRYPT_ROUNDS } = require('../secrets/index');
const Users = require('../users/users-model');
const bcrypt = require('bcryptjs');

const {
  checkUsernameAvailable,
  validateUser,
  checkUsernameExists,
} = require('./auth-middleware');
const tokenBuilder = require('./token-builder');

router.post(
  '/register',
  validateUser,
  checkUsernameAvailable,
  async (req, res, next) => {
    try {
      const user = req.body;
      const hash = bcrypt.hashSync(user.password, Number(BCRYPT_ROUNDS)); // <<<Why do I need to convert BCRYPT_ROUNDS to a number? In the auth2 project setting BCRYPT_ROUNDS to 12 in .env saved it as a number, but now for some reason BCRYPT_ROUNDS: 8 is saving 8 as a string.
      user.password = hash;
      const newUser = await Users.add(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  validateUser,
  checkUsernameExists,
  async (req, res, next) => {
    try {
      const user = req.user;
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = tokenBuilder(user);
        res.status(200).json({ message: `Welcome, ${user.username}`, token });
      } else {
        next({ status: 401, message: 'invalid credentials' });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
