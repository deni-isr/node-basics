import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {findUserByUsername} from '../models/user-model.js';

const login = async (req, res) => {
  const {username, password} = req.body;

  // find user by username
  const user = await findUserByUsername(username);
  
  if (!user) {
    return res.status(401).json({message: 'Invalid username or password'});
  }

  // check password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({message: 'Invalid username or password'});
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      user_id: user.user_id,
      user_level_id: user.user_level_id,
    },
    process.env.JWT_SECRET,
    {expiresIn: '24h'} // Токен живет 24 часа
  );

  // Send response with token
  res.json({message: 'Login successful', token, user: {username: user.username, email: user.email}});
};

export {login};