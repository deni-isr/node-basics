import promisePool from '../utils/database.js';

/**
 * @param {number} media_id
 * @param {number} user_id
 * @returns {object}
 */
const addLike = async (media_id, user_id) => {
  const [existing] = await promisePool.execute(
    'SELECT like_id FROM Likes WHERE media_id = ? AND user_id = ?',
    [media_id, user_id]
  );
  if (existing.length > 0) {
    return {message: 'Already liked', like_id: existing[0].like_id};
  }
  
  const sql = 'INSERT INTO Likes (media_id, user_id) VALUES (?, ?)';
  const params = [media_id, user_id];
  try {
    const [result] = await promisePool.execute(sql, params);
    return {like_id: result.insertId};
  } catch (e) {
    console.error('error adding like', e.message);
    return {error: e.message};
  }
};

/**
 * @param {number} like_id
 * @returns {boolean}
 */
const deleteLike = async (like_id) => {
  const sql = 'DELETE FROM Likes WHERE like_id = ?';
  try {
    const [result] = await promisePool.execute(sql, [like_id]);
    return result.affectedRows === 1;
  } catch (e) {
    console.error('error deleting like', e.message);
    return {error: e.message};
  }
};

/**
 * @param {number} media_id
 * @returns {number}
 */
const countLikesByMediaId = async (media_id) => {
  const sql = 'SELECT COUNT(like_id) AS total_likes FROM Likes WHERE media_id = ?';
  try {
    const [rows] = await promisePool.execute(sql, [media_id]);
    return rows[0].total_likes;
  } catch (e) {
    console.error('error counting likes', e.message);
    return {error: e.message};
  }
};

export {addLike, deleteLike, countLikesByMediaId};