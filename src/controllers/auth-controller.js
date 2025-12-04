import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {findUserByUsername} from '../models/user-model.js';

const login = async (req, res, next) => {
  
  const {username, password} = req.body;

  try {
    const user = await findUserByUsername(username);

    // If user not found
    if (!user) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    // Password verification
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    // If everything is ok, generate JWT
    const token = jwt.sign(
      {
        user_id: user.user_id, 
        user_level_id: 
        user.user_level_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.json({message: 'Login successful', token, user: {username: user.username, email: user.email}});
  } catch (e) {
    next(e);
  }
};

export {login};