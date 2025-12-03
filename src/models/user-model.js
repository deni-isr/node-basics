import promisePool from '../utils/database.js';

const listAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT user_id, username, email, user_level_id FROM Users');
    return rows;
  } catch (e) {
    console.error('error listing users', e.message);
    return {error: e.message};
  }
};

const findUserById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT user_id, username, email, user_level_id FROM Users WHERE user_id = ?',
      [id],
    );
    return rows[0];
  } catch (e) {
    console.error('error finding user', e.message);
    return {error: e.message};
  }
};

const addUser = async (user) => {
  const {username, password, email, user_level_id} = user;
  const sql = `
    INSERT INTO Users (username, password, email, user_level_id)
    VALUES (?, ?, ?, ?)
  `;
  const params = [username, password, email, user_level_id || 2]; // По умолчанию уровень 2 (User)
  try {
    const [result] = await promisePool.execute(sql, params);
    return {user_id: result.insertId};
  } catch (e) {
    console.error('error adding user', e.message);
    return {error: e.message};
  }
};

const updateUserById = async (user) => {
  const {username, email, user_level_id, user_id} = user;
  const sql = `
    UPDATE Users
    SET username = ?, email = ?, user_level_id = ?
    WHERE user_id = ?
  `;
  const params = [username, email, user_level_id, user_id];
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.affectedRows === 1;
  } catch (e) {
    console.error('error updating user', e.message);
    return {error: e.message};
  }
};

const deleteUserById = async (id) => {
  const sql = 'DELETE FROM Users WHERE user_id = ?';
  try {
    const [result] = await promisePool.execute(sql, [id]);
    return result.affectedRows === 1;
  } catch (e) {
    console.error('error deleting user', e.message);
    return {error: e.message};
  }
};

const findUserByUsername = async (username) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM Users WHERE username = ?',
      [username],
    );
    return rows[0];
  } catch (e) {
    console.error('error finding user by username', e.message);
    return {error: e.message};
  }
};

export {listAllUsers, findUserById, addUser, updateUserById, deleteUserById, findUserByUsername};