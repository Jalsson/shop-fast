const pool = require("../database/db");
const promisePool = pool.promise();

const insertMessage = async (data) => {
  try {
  const [messageRow] = await promisePool.query('INSERT INTO Message (message) VALUES (?)', [data.message]);
  const insertedID = messageRow.insertId
  const [relationRow] = await promisePool.query('INSERT INTO User_message_relation (user_id, sent_user_id, message_id) VALUES (?,?,?)', [ data.senderID, data.userToSendID, insertedID]);
  return relationRow;
} catch (e) {
  console.log('error', e.message);
}
}

const selectMessages = async (id) => {
  try {
    const [
      rows,
    ] = await promisePool.query(
      "SELECT Message.message, User_message_relation.user_id, User_message_relation.sent_user_id,(SELECT username FROM Users WHERE id = User_message_relation.user_id) AS sender,(SELECT username FROM Users WHERE id = User_message_relation.sent_user_id) AS receiver FROM Message INNER JOIN User_message_relation ON User_message_relation.user_id = ? OR User_message_relation.sent_user_id = ? WHERE Message.id = User_message_relation.message_id",
      [id, id]
    );
    return rows;
  } catch (e) {
    console.log("error", e.message);
  }
};
module.exports = {
  selectMessages,
  insertMessage
};
