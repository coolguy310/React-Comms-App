const moment = require("moment");
require("moment-timezone");
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

// Pass in the channelId and userId to fetch all mentioned posts of the user in the channel
const getMentionedPostsInChannel = async (channelId, currentUserId) =>
  (
    await db
      .collection(`channels/${channelId}/posts`)
      .where("mentions", "array-contains", currentUserId)
      .get()
  ).docs.map((doc) => doc.data());

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

// Edit a post in the inbox of a user
const editInboxPost = (user, post, key, value) => {
  db.collection(`users/${user.uid}/inbox`)
    .doc(post.id)
    .update({
      [key]: value,
    })
    .then((doc) => {
      functions.logger.info(
        "Inbox post updated successfully!, userId => ",
        user.uid,
        "postId => ",
        post.id,
        ",",
        key,
        "changed to =>",
        value
      );
    });
};

// Check the notification preference for the specific channel of that post, and notify/(not notify) in inbox
const checkNotificationPreference = async (user, post) => {
  const preferences = user.notifyPreferences || {};

  const channelPreference = preferences[post.channelId];

  // If there is no valid channel preference, notify only if the user is mentioned in the post
  if (!channelPreference && post.mentions.includes(user.uid)) {
    return addToInbox(user, post);
  }

  // If preference is `involved`, notify for every post where the user has been mentioned before in that channel
  if (channelPreference === "involved") {
    // First, we get all mentioned posts in that channel

    const channelPosts = await getMentionedPostsInChannel(
      post.channelId,
      user.uid
    );

    // If there are any mentioned posts, then add to inbox
    if (channelPosts.length) {
      return addToInbox(user, post);
    }
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

// Resolves a promise after a specified time
const waitTill = (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("Done!");
    }, time * 1000);
  });
};

// wait till specified time, then add post to inbox
exports.handleTriageTill = functions.https.onCall(async (data, context) => {
  await waitTill(data.time);

  return addToInbox(context.auth, data.post);
});

// Run a scheduled function every minute that:
exports.scheduledFunction = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    // Fetches all users,
    const users = await db.collection("users").get();

    return users.forEach(async (doc) => {
      const user = doc.data();

      // Then gets all posts in the user's inbox where the `triagedTill` timestamp is lesser than the current timestamp (now)
      const usersCurrentTriages = await db
        .collection(`users/${user.uid}/inbox`)
        .where("triagedTill", "<", moment(new Date()).valueOf())
        .get();

      usersCurrentTriages.forEach((doc) => {
        const post = doc.data();

        // and finally, it updates all such posts by setting the `triagedTill` value to null
        editInboxPost(user, post, "triagedTill", null);
      });
    });
  });
