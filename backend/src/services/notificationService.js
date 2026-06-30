import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, type, title, message, link }) =>
  Notification.create({ user: userId, type, title, message, link });

export const notifyMany = async (userIds, payload) => {
  const docs = userIds.map((userId) => ({ user: userId, ...payload }));
  return Notification.insertMany(docs);
};
