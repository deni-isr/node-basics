import promisePool from '../utils/database.js';

const listAllMedia = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM MediaItems');
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};


// media-model.js

// ... существующие функции listAllMedia, findMediaById, addMedia ...

const updateMediaById = async (media) => {
  const {title, description, media_id} = media;
  const sql = `
    UPDATE MediaItems
    SET title = ?, description = ?
    WHERE media_id = ?
  `;
  const params = [title, description, media_id];
  try {
    const [result] = await promisePool.execute(sql, params);
    // Проверяем, была ли изменена хотя бы одна строка
    return result.affectedRows === 1; 
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const deleteMediaById = async (id) => {
  const sql = 'DELETE FROM MediaItems WHERE media_id = ?';
  const params = [id];
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.affectedRows === 1; 
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};


const findMediaById = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM mediaItems WHERE media_id = ?', [id]);
    console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addMedia = async (media) => {
  const {user_id, filename, size, mimetype, title, description} = media;
  const sql = `INSERT INTO mediaItems (user_id, filename, filesize, media_type, title, description)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, filename, size, mimetype, title, description];
  try {
    const [result] = await promisePool.execute(sql, params);
    //console.log('rows', rows);
    return {media_id: result.insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {listAllMedia, findMediaById, addMedia, updateMediaById, deleteMediaById};