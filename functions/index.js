const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// Fetch all other users except the current user (you don't want to see notifications of your own posts)
const getOtherUsers = async (currentUserId) =>
  await db.collection("users").where("uid", "!=", currentUserId).get();

// Add post to inbox of user
const addToInbox = (user, post) => {
  db.collection(`users/${user.uid}/inbox`)
    .doc(post.id)
    .set(post)
    .then((doc) => {
      functions.logger.info(
        "Post added to inbox successfully!, userId => ",
        user.uid,
        "postId => ",
        post.id
      );
    });
};

// Check the notification preference for the specific channel of that post, and notify/(not notify) in inbox
const checkNotificationPreference = (user, post) => {
  const preferences = user.notifyPreferences || {};

  const channelPreference = preferences[post.channelId];

  // If there is no valid channel preference, notify only if the user is mentioned in the post
  if (!channelPreference && post.mentions.includes(user.uid)) {
    return addToInbox(user, post);
  }

  // If preference is `all`, notify for every post
  if (channelPreference === "all") {
    return addToInbox(user, post);
  }
};

// Listen for everytime a post is created
exports.onPostCreated = functions.firestore
  .document("channels/{channelId}/posts/{postId}")
  .onCreate(async (snap, context) => {
    const post = snap.data();

    const users = await getOtherUsers(post.authorId);

    return users.forEach((doc) =>
      checkNotificationPreference(doc.data(), post)
    );
  });
