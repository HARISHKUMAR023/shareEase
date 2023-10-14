const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteOldItems = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const cutoffDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    const itemsSnapshot = await admin.firestore().collection('items').where('postedDateTime', '<', cutoffDate).get();
    const batch = admin.firestore().batch();
    itemsSnapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  });