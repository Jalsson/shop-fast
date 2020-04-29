const pool = require('../database/db');
const promisePool = pool.promise();


/*const insertUser = async (user) => {
  try {
  const [rows] = await promisePool.query('INSERT INTO Users (username,email,password) VALUES (?,?,?)', [ user.name, user.email, user.password ]);
  return rows;
} catch (e) {
  console.log('error', e.message);
}
}*/

const selectMessages = async (id) => {
try {
const [rows] = await promisePool.query("SELECT Message.message, User_message_relation.user_id, (Select username FROM Users WHERE id = User_message_relation.sent_user_id XOR User_message_relation.user_id) AS sender, User_message_relation.sent_user_id, (Select username FROM Users WHERE id = User_message_relation.user_id XOR User_message_relation.sent_user_id) AS receiver FROM Message INNER JOIN User_message_relation ON User_message_relation.user_id = ? OR User_message_relation.sent_user_id = ? WHERE Message.id = User_message_relation.message_id", [ id, id]);
return rows
} catch (e) {
console.log('error', e.message);
}
}
module.exports = {
selectMessages
};