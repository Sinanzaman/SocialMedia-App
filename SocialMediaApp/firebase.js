import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const generateRandomName = (length) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomName = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomName += charset[randomIndex];
  }
  return randomName;
};

const CheckSignUp = async (username, password = "") => {
  const usernameSnapshot = await db
    .collection("users")
    .where("username", "==", username)
    .get();
  if (!usernameSnapshot.empty) {
    return "Bu kullanıcı adı kullanımda";
  } else if (username.length < 6) {
    return "Kullanıcı adı çok kısa";
  } else if (password && password.length < 6) {
    return "Şifre çok kısa";
  }
  return "true";
};

const SetUser = async (NameSurname, username) => {
  try {
    const user = auth.currentUser;
    const useruid = user.uid;
    if (user.uid) {
      await db.collection("users").doc(useruid).set(
        {
          namesurname: NameSurname,
          username: username,
          myPrivacy: false,
          followers: [],
          followings: [],
          myFavorites: [],
          followingRequests: [],
        },
        { merge: true }
      );
    } else {
      console.error("Kullanıcı oturumu açmamış.");
    }
  } catch (error) {
    console.error("Kullanıcının Adı kaydedilirken bir hata oluştu: ", error);
  }
};

const SetNameSurname = async (NameSurname) => {
  try {
    const user = auth.currentUser;
    const useruid = user.uid;
    if (user.uid) {
      const user_name_surname = NameSurname;
      await db.collection("users").doc(useruid).set(
        {
          namesurname: user_name_surname,
        },
        { merge: true }
      );
      console.log("Kullanıcının Adı başarıyla kaydedildi.");
    } else {
      console.error("Kullanıcı oturumu açmamış.");
    }
  } catch (error) {
    console.error("Kullanıcının Adı kaydedilirken bir hata oluştu: ", error);
  }
};

const SetUsername = async (username) => {
  try {
    const user = auth.currentUser;
    const user_username = username;
    if (user.uid) {
      await db.collection("users").doc(user.uid).set(
        {
          username: user_username,
        },
        { merge: true }
      );
      console.log("KullanıcıAdı başarıyla kaydedildi.");
    } else {
      console.error("Kullanıcı oturumu açmamış.");
    }
  } catch (error) {
    console.error("KullanıcıAdı kaydedilirken bir hata oluştu: ", error);
  }
};

const getUserData = async (useruid) => {
  try {
    const userdoc = await db.collection("users").doc(useruid).get();
    if (userdoc.exists) {
      const userdata = userdoc.data();
      return userdata;
    } else {
      console.log("Kullanıcı bilgileri bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Kullanıcı bilgileri alınırken bir hata oluştu: ", error);
    return null;
  }
};

const getRandomUserData = async () => {
  try {
    const usersSnapshot = await db
      .collection("users")
      .where("myPrivacy", "==", false)
      .get();
    if (usersSnapshot.empty) {
      console.log("Hesap bulunamadı.");
      return null;
    }

    const userIds = usersSnapshot.docs.map((doc) => doc.id);
    while (userIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * userIds.length);
      const randomUserId = userIds.splice(randomIndex, 1)[0]; // Kullanıcıyı listeden çıkar

      const postDocs = await db
        .collection("users")
        .doc(randomUserId)
        .collection("posts")
        .get();
      if (!postDocs.empty) {
        const randomPostIndex = Math.floor(Math.random() * postDocs.size);
        const randomPost = postDocs.docs[randomPostIndex];
        const postData = randomPost.data();

        if (postData.posturl && postData.posttime) {
          return [
            {
              useruid: randomUserId,
              posttime: postData.posttime,
            },
          ];
        }
      }
    }

    console.log("Uygun bir kullanıcı veya post bulunamadı.");
    return null;
  } catch (error) {
    console.error("Kullanıcı bilgileri alınırken bir hata oluştu: ", error);
    return null;
  }
};

const SetBiography = async (biography) => {
  try {
    const user = auth.currentUser;
    if (user.uid) {
      await db.collection("users").doc(user.uid).set(
        {
          biography: biography,
        },
        { merge: true }
      );
      console.log("Biyografi başarıyla kaydedildi.");
    } else {
      console.error("Kullanıcı oturumu açmamış.");
    }
  } catch (error) {
    console.error("Biyografi kaydedilirken bir hata oluştu: ", error);
  }
};

const SetMyPost = async (
  posttime,
  desc,
  file,
  aspectRatio,
  type,
  allowcomments
) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  const randomname = generateRandomName(16);
  try {
    const storageRef = storage
      .ref()
      .child("users")
      .child(useruid)
      .child("posts")
      .child(randomname);
    await storageRef.put(file);
    const downloadURL = await storageRef.getDownloadURL();
    await db
      .collection("users")
      .doc(useruid)
      .collection("posts")
      .doc(posttime)
      .set(
        {
          posttime: posttime,
          posturl: downloadURL,
          likes: [],
          comments: [],
          favorited: [],
          desc: desc,
          aspectRatio: aspectRatio,
          type: type,
          allowcomments: allowcomments,
        },
        { merge: true }
      );
    console.log("Post başarıyla kaydedildi.");
    const callback = true;
    return callback;
  } catch (error) {
    console.error("Post kaydedilirken bir hata oluştu: ", error);
    const callback = false;
    return callback;
  }
};

const updateMyPost = async (posttime, desc, editallowcomments) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    await db
      .collection("users")
      .doc(useruid)
      .collection("posts")
      .doc(posttime)
      .set(
        {
          desc: desc,
          allowcomments: editallowcomments,
        },
        { merge: true }
      );
    console.log("Post başarıyla kaydedildi.");
    const callback = true;
    return callback;
  } catch (error) {
    console.error("Post kaydedilirken bir hata oluştu: ", error);
    const callback = false;
    return callback;
  }
};

const LikePost = async (postuid, posttime, currentUsername) => {
  const user = auth.currentUser;
  try {
    const postRef = db
      .collection("users")
      .doc(postuid)
      .collection("posts")
      .doc(posttime);
    await postRef.update({
      likes: firebase.firestore.FieldValue.arrayUnion(user.uid),
    });
    if (postuid != user.uid) {
      const postRef2 = db.collection("users").doc(postuid);
      await postRef2.update({
        notifications: firebase.firestore.FieldValue.arrayUnion(
          `${currentUsername} gönderinizi beğendi`
        ),
      });
    }
    console.log("Post beğenildi.");
  } catch (error) {
    console.error("Post beğenirken bir hata oluştu: ", error);
  }
};

const UnlikePost = async (postuid, posttime) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    const postRef = db
      .collection("users")
      .doc(postuid)
      .collection("posts")
      .doc(posttime);
    await postRef.update({
      likes: firebase.firestore.FieldValue.arrayRemove(useruid),
    });
    console.log("Post beğenme kaldırıldı.");
  } catch (error) {
    console.error("Post beğenme kaldırılırken bir hata oluştu: ", error);
  }
};

const AddFavorite = async (postuid, posttime) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    const postRef = db
      .collection("users")
      .doc(postuid)
      .collection("posts")
      .doc(posttime);
    await postRef.update({
      favorited: firebase.firestore.FieldValue.arrayUnion(useruid),
    });
    await db
      .collection("users")
      .doc(useruid)
      .update({
        myFavorites: firebase.firestore.FieldValue.arrayUnion({
          postuid: postuid,
          posttime: posttime,
        }),
      });
    console.log("Post favorilere eklendi.");
  } catch (error) {
    console.error("Post favorilere eklenirken bir hata oluştu: ", error);
  }
};

const Deletefavorite = async (postuid, posttime) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    const postRef = db
      .collection("users")
      .doc(postuid)
      .collection("posts")
      .doc(posttime);
    await postRef.update({
      favorited: firebase.firestore.FieldValue.arrayRemove(useruid),
    });
    await db
      .collection("users")
      .doc(useruid)
      .update({
        myFavorites: firebase.firestore.FieldValue.arrayRemove({
          postuid: postuid,
          posttime: posttime,
        }),
      });
    console.log("Post favorilerden kaldırıldı.");
  } catch (error) {
    console.error("Post favorilerden kaldırılırken bir hata oluştu: ", error);
  }
};

const AddFollowing = async (useruid, myusername) => {
  const user = auth.currentUser;
  try {
    const postRef = db.collection("users").doc(user.uid);
    await postRef.update({
      followings: firebase.firestore.FieldValue.arrayUnion(useruid),
    });
    const postRef2 = db.collection("users").doc(useruid);
    await postRef2.update({
      followers: firebase.firestore.FieldValue.arrayUnion(user.uid),
    });
    const postRef3 = db.collection("users").doc(useruid);
    await postRef3.update({
      followers: firebase.firestore.FieldValue.arrayUnion(
        `${myusername} sizi takip etmeye başladı`
      ),
    });
    console.log("Kullanıcı takip edilenlere eklendi.");
  } catch (error) {
    console.error(
      "Kullanıcı takip edilenlere eklenirken bir hata oluştu: ",
      error
    );
  }
};

const DeleteFollowing = async (useruid) => {
  const user = auth.currentUser;
  try {
    const postRef = db.collection("users").doc(user.uid);
    await postRef.update({
      followings: firebase.firestore.FieldValue.arrayRemove(useruid),
    });
    const postRef2 = db.collection("users").doc(useruid);
    await postRef2.update({
      followers: firebase.firestore.FieldValue.arrayRemove(user.uid),
    });
    console.log("Kullanıcı takip edilenlerden kaldırıldı.");
  } catch (error) {
    console.error(
      "Kullanıcı takip edilenlerden kaldırılırken bir hata oluştu: ",
      error
    );
  }
};

const DeleteFollower = async (useruid) => {
  const user = auth.currentUser;
  try {
    const postRef = db.collection("users").doc(user.uid);
    await postRef.update({
      followers: firebase.firestore.FieldValue.arrayRemove(useruid),
    });
    const postRef2 = db.collection("users").doc(useruid);
    await postRef2.update({
      followings: firebase.firestore.FieldValue.arrayRemove(user.uid),
    });
    console.log("Takipçi kaldırıldı.");
  } catch (error) {
    console.error("Takipçi kaldırılırken bir hata oluştu: ", error);
  }
};

const AddFollowingRequest = async (useruid, myusername) => {
  const user = auth.currentUser;
  try {
    const postRef = db.collection("users").doc(useruid);
    await postRef.update({
      followingRequests: firebase.firestore.FieldValue.arrayUnion(user.uid),
    });
    const postRef2 = db.collection("users").doc(useruid);
    await postRef2.update({
      notifications: firebase.firestore.FieldValue.arrayUnion(
        `${myusername} sizi takip etmek istiyor`
      ),
    });
    console.log("Kullanıcı takip isteği eklendi.");
  } catch (error) {
    console.error("Kullanıcı takip isteği eklenirken bir hata oluştu: ", error);
  }
};

const DeleteFollowingRequest = async (useruid) => {
  const user = auth.currentUser;
  try {
    const postRef = db.collection("users").doc(useruid);
    await postRef.update({
      followingRequests: firebase.firestore.FieldValue.arrayRemove(user.uid),
    });
    console.log("Kullanıcı takip isteği kaldırıldı.");
  } catch (error) {
    console.error(
      "Kullanıcı takip isteği kaldırılırken bir hata oluştu: ",
      error
    );
  }
};

const AcceptRequest = async (useruid, myusername) => {
  const user = auth.currentUser;
  try {
    const postRef = db.collection("users").doc(user.uid);
    await postRef.update({
      followers: firebase.firestore.FieldValue.arrayUnion(useruid),
    });
    const postRef2 = db.collection("users").doc(useruid);
    await postRef2.update({
      followings: firebase.firestore.FieldValue.arrayUnion(user.uid),
    });
    const postRef3 = db.collection("users").doc(user.uid);
    await postRef3.update({
      followingRequests: firebase.firestore.FieldValue.arrayRemove(useruid),
    });
    const postRef4 = db.collection("users").doc(useruid);
    await postRef4.update({
      notifications: firebase.firestore.FieldValue.arrayUnion(
        `${myusername} takip isteğinizi kabul etti`
      ),
    });
    console.log("Kullanıcı takip isteği kabul edildi.");
  } catch (error) {
    console.error(
      "Kullanıcı takip isteği kabul edilirken bir hata oluştu: ",
      error
    );
  }
};

const RejectRequest = async (useruid) => {
  const user = auth.currentUser;
  try {
    const postRef = db.collection("users").doc(user.uid);
    await postRef.update({
      followingRequests: firebase.firestore.FieldValue.arrayRemove(useruid),
    });
    console.log("Kullanıcı takip isteği reddedildi.");
  } catch (error) {
    console.error(
      "Kullanıcı takip isteği reddedilirken bir hata oluştu: ",
      error
    );
  }
};

const DeleteMyPost = async (posttime, fileUrl) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    await db
      .collection("users")
      .doc(useruid)
      .collection("posts")
      .doc(posttime)
      .delete();
    const storageRef = storage.refFromURL(fileUrl);
    await storageRef.delete();
    console.log("Post başarıyla silindi.");
  } catch (error) {
    console.error("Post silinirken bir hata oluştu: ", error);
  }
};

const getAllPosts = async (useruid) => {
  try {
    const postDocs = await db
      .collection("users")
      .doc(useruid)
      .collection("posts")
      .get();
    if (!postDocs.empty) {
      const posts = [];
      postDocs.forEach((doc) => {
        const postData = doc.data();
        if (postData.posturl && postData.posttime) {
          posts.push({
            posturl: postData.posturl,
            posttime: postData.posttime,
            posttype: postData.type,
          });
        }
      });
      return posts;
    } else {
      console.log("Post bulunamadı.");
      return [];
    }
  } catch (error) {
    console.error("Post verileri alınırken bir hata oluştu: ", error);
    return [];
  }
};

const getPost = async (useruid, posttime) => {
  try {
    const postDoc = await db
      .collection("users")
      .doc(useruid)
      .collection("posts")
      .doc(posttime)
      .get();
    if (postDoc.exists) {
      const postData = postDoc.data();
      return postData;
    } else {
      console.log("Post bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Post verileri alınırken bir hata oluştu: ", error);
    return null;
  }
};

const SetFollowers = async (followerId) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    const followersRef = db.collection("users").doc(useruid);
    const doc = await followersRef.get();
    if (doc.exists) {
      const data = doc.data();
      const followers = data.followers || [];
      const index = followers.indexOf(followerId);
      if (index !== -1) {
        followers.splice(index, 1);
      } else {
        followers.push(followerId);
      }
      await followersRef.set(
        {
          followers: followers,
        },
        { merge: true }
      );
      console.log("Takipçiler başarıyla kaydedildi.");
    } else {
      const newFollowers = [followerId];
      await followersRef.set(
        {
          followers: newFollowers,
        },
        { merge: true }
      );
      console.log("Takipçiler başarıyla kaydedildi.");
    }
  } catch (error) {
    console.error("Takipçiler kaydedilirken bir hata oluştu: ", error);
  }
};

const SetFollowings = async (followingId) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    const followingsRef = db.collection("users").doc(useruid);
    const doc = await followingsRef.get();
    if (doc.exists) {
      const data = doc.data();
      const followings = data.followings || [];
      const index = followings.indexOf(followingId);
      if (index !== -1) {
        followings.splice(index, 1);
      } else {
        followings.push(followingId);
      }
      await followingsRef.set(
        {
          followings: followings,
        },
        { merge: true }
      );
      console.log("Takip Edilenler başarıyla kaydedildi.");
    } else {
      const newFollowings = [followingId];
      await followingsRef.set(
        {
          followings: newFollowings,
        },
        { merge: true }
      );
      console.log("Takip Edilenler başarıyla kaydedildi.");
    }
  } catch (error) {
    console.error("Takip Edilenler kaydedilirken bir hata oluştu: ", error);
  }
};

const SetUserProfilePicture = async (file, callback) => {
  const user = auth.currentUser;
  const useruid = user.uid;
  try {
    const storageRef = storage
      .ref()
      .child("users")
      .child(useruid)
      .child("ProfilePicture.img");
    await storageRef.put(file);
    const downloadURL = await storageRef.getDownloadURL();
    const userRef = db.collection("users").doc(useruid);
    await userRef.set({ profilePictureUrl: downloadURL }, { merge: true });
    callback(true);
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    callback(false); // Yükleme başarısız
  }
};

const SetMyPrivacy = async (pravicy) => {
  try {
    const user = auth.currentUser;
    const useruid = user.uid;
    if (user.uid) {
      await db.collection("users").doc(useruid).set(
        {
          myPrivacy: pravicy,
        },
        { merge: true }
      );
      console.log("Gizlilik başarıyla kaydedildi.");
    } else {
      console.error("Kullanıcı oturumu açmamış.");
    }
  } catch (error) {
    console.error("Gizlilik kaydedilirken bir hata oluştu: ", error);
  }
};

const SetMessage = async (receiverId, messageText, messagetype) => {
  try {
    const user = auth.currentUser;
    const senderId = user.uid;
    const timestamp = new Date().toISOString();
    if (user.uid) {
      const messageData = {
        senderId: senderId,
        receiverId: receiverId,
        messageText: messageText,
        timestamp: timestamp,
        messagetype: messagetype,
      };
      const senderReceiverDocRef = db
        .collection("messages")
        .doc(`${senderId}_${receiverId}`);
      const receiverSenderDocRef = db
        .collection("messages")
        .doc(`${receiverId}_${senderId}`);

      const saveusermessage = db.collection("users").doc(receiverId);
      const savemymessage = db.collection("users").doc(senderId);

      await saveusermessage.update({
        messageids: firebase.firestore.FieldValue.arrayUnion(senderId),
      });
      await savemymessage.update({
        messageids: firebase.firestore.FieldValue.arrayUnion(receiverId),
      });

      const senderReceiverDoc = await senderReceiverDocRef.get();
      if (senderReceiverDoc.exists) {
        await senderReceiverDocRef.update({
          messages: firebase.firestore.FieldValue.arrayUnion(messageData),
        });
      } else {
        const receiverSenderDoc = await receiverSenderDocRef.get();
        if (receiverSenderDoc.exists) {
          await receiverSenderDocRef.update({
            messages: firebase.firestore.FieldValue.arrayUnion(messageData),
          });
        } else {
          await senderReceiverDocRef.set({
            messages: [messageData],
          });
        }
      }
    }
  } catch (error) {
    console.error("Error adding message: ", error);
  }
};

const SetPostMessage = async (
  receiverId,
  messagetype,
  postOwner,
  posttime,
  postUrl,
  postType
) => {
  try {
    const user = auth.currentUser;
    const senderId = user.uid;
    const timestamp = new Date().toISOString();
    if (user.uid) {
      const messageData = {
        senderId: senderId,
        receiverId: receiverId,
        timestamp: timestamp,
        messagetype: messagetype,
        postOwner: postOwner,
        posttime: posttime,
        postUrl: postUrl,
        postType: postType,
      };
      const senderReceiverDocRef = db
        .collection("messages")
        .doc(`${senderId}_${receiverId}`);
      const receiverSenderDocRef = db
        .collection("messages")
        .doc(`${receiverId}_${senderId}`);

      const saveusermessage = db.collection("users").doc(receiverId);
      const savemymessage = db.collection("users").doc(senderId);

      await saveusermessage.update({
        messageids: firebase.firestore.FieldValue.arrayUnion(senderId),
      });
      await savemymessage.update({
        messageids: firebase.firestore.FieldValue.arrayUnion(receiverId),
      });

      const senderReceiverDoc = await senderReceiverDocRef.get();
      if (senderReceiverDoc.exists) {
        await senderReceiverDocRef.update({
          messages: firebase.firestore.FieldValue.arrayUnion(messageData),
        });
      } else {
        const receiverSenderDoc = await receiverSenderDocRef.get();
        if (receiverSenderDoc.exists) {
          await receiverSenderDocRef.update({
            messages: firebase.firestore.FieldValue.arrayUnion(messageData),
          });
        } else {
          await senderReceiverDocRef.set({
            messages: [messageData],
          });
        }
      }
    }
  } catch (error) {
    console.error("Error adding message: ", error);
  }
};

const SetMessageWriting = async (receiverId, isWriting) => {
  try {
    const user = auth.currentUser;
    const senderId = user.uid;
    if (user.uid) {
      const senderReceiverDocRef = db
        .collection("messages")
        .doc(`${senderId}_${receiverId}`);
      const receiverSenderDocRef = db
        .collection("messages")
        .doc(`${receiverId}_${senderId}`);
      const senderReceiverDoc = await senderReceiverDocRef.get();
      if (senderReceiverDoc.exists) {
        await senderReceiverDocRef.update({
          [senderId]: isWriting,
        });
      } else {
        const receiverSenderDoc = await receiverSenderDocRef.get();
        if (receiverSenderDoc.exists) {
          await receiverSenderDocRef.update({
            [senderId]: isWriting,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error updating writing status: ", error);
  }
};

const getMessages = async (useruid) => {
  const user = auth.currentUser;
  try {
    const messageDoc1 = db.collection("messages").doc(`${user.uid}_${useruid}`);
    const messageDoc2 = db.collection("messages").doc(`${useruid}_${user.uid}`);

    let messageSnapshot = await messageDoc1.get();
    if (messageSnapshot.exists) {
      const messages = messageSnapshot.data().messages || [];
      if (messages.length > 0) {
        if (messages[messages.length - 1].messagetype == "text") {
          return {
            lastMessage: messages[messages.length - 1].messageText,
            lastMessageOwner: messages[messages.length - 1].senderId,
            lastMessageType: "text",
          };
        } else if (messages[messages.length - 1].messagetype == "post") {
          return {
            lastMessage: "post",
            lastMessageOwner: messages[messages.length - 1].senderId,
            lastMessageType: messages[messages.length - 1].messagetype,
          };
        }
      }
    }
    messageSnapshot = await messageDoc2.get();
    if (messageSnapshot.exists) {
      const messages = messageSnapshot.data().messages || [];
      if (messages.length > 0) {
        if (messages[messages.length - 1].messagetype == "text") {
          return {
            lastMessage: messages[messages.length - 1].messageText,
            lastMessageOwner: messages[messages.length - 1].senderId,
            lastMessageType: "text",
          };
        } else if (messages[messages.length - 1].messagetype == "post") {
          return {
            lastMessage: "post",
            lastMessageOwner: messages[messages.length - 1].senderId,
            lastMessageType: messages[messages.length - 1].messagetype,
          };
        }
      }
    }
    console.log("Mesaj bulunamadı.");
    return {
      lastMessage: "",
      lastMessageOwner: "",
    };
  } catch (error) {
    console.error("Mesajları çekerken bir hata oluştu: ", error);
  }
};

const SetComment = async (useruid, posttime, newComment, currentUsername) => {
  const user = auth.currentUser;
  const myuid = user.uid;
  const userData = await getUserData(myuid);
  const { profilePictureUrl, username } = userData;
  try {
    const DocRef = db
      .collection("users")
      .doc(useruid)
      .collection("posts")
      .doc(posttime);
    await DocRef.update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        postowner: useruid,
        comment: newComment,
        profilePictureUrl: profilePictureUrl,
        username: username,
        commentowner: user.uid,
      }),
    });
    if (useruid != user.uid) {
      const DocRef2 = db.collection("users").doc(useruid);
      await DocRef2.update({
        notifications: firebase.firestore.FieldValue.arrayUnion(
          `${currentUsername} gönderinize yorum yaptı : ${newComment}`
        ),
      });
    }
    console.log("Yorum ekleme başarılı.");
  } catch (error) {
    console.error("Yorum eklenirken bir hata oluştu: ", error);
  }
};

const DeleteComment = async (
  useruid,
  postowner,
  posttime,
  commentToDelete,
  profilePictureUrl,
  username,
  commentowner
) => {
  console.log(
    useruid,
    postowner,
    posttime,
    commentToDelete,
    profilePictureUrl,
    username,
    commentowner
  );
  try {
    const DocRef = db
      .collection("users")
      .doc(useruid)
      .collection("posts")
      .doc(posttime);
    const doc = await DocRef.get();
    if (doc.exists) {
      await DocRef.update({
        comments: firebase.firestore.FieldValue.arrayRemove({
          postowner: postowner,
          comment: commentToDelete,
          profilePictureUrl: profilePictureUrl,
          username: username,
          commentowner: commentowner,
        }),
      });
      console.log("Yorum silme başarılı.");
    }
  } catch (error) {
    console.error("Yorum silinirken bir hata oluştu: ", error);
  }
};

const DeleteNotification = async (useruid, notificationId) => {
  console.log("useruid", useruid);
  console.log("notificationId", notificationId);
  try {
    const userRef = db.collection("users").doc(useruid);
    await userRef.update({
      notifications: firebase.firestore.FieldValue.arrayRemove(notificationId),
    });
    console.log("Bildirim başarıyla silindi.");
  } catch (error) {
    console.error("Bildirim silinirken bir hata oluştu: ", error);
  }
};

const SetExpoPushToken = async (token) => {
  try {
    await RemoveExpoPushToken(token.data);
    const user = auth.currentUser;
    const useruid = user.uid;
    if (useruid) {
      await db.collection("users").doc(useruid).update(
        {
          expopushtoken: token.data,
        },
        { merge: true }
      );
      console.log("Token başarıyla güncellendi veya eklendi.");
    }
  } catch (error) {
    console.error("Token ayarlanırken bir hata oluştu:", error);
  }
};

const RemoveExpoPushToken = async (token) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    let found = false;

    usersSnapshot.forEach(async (doc) => {
      const userData = doc.data();
      if (userData.expopushtoken === token) {
        found = true;
        await db.collection("users").doc(doc.id).update(
          {
            expopushtoken: "",
          },
          { merge: true }
        );
        console.log(`Token ${token} null olarak güncellendi.`);
      }
    });
    if (!found) {
      console.log("Belirtilen token bulunamadı.");
    }
  } catch (error) {
    console.error("Token silinirken bir hata oluştu:", error);
  }
};

const getExpoPushToken = async (useruid) => {
  try {
    if (useruid) {
      const userDoc = await db.collection("users").doc(useruid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData.expopushtoken;
      } else {
        console.log("Kullanıcı bulunamadı.");
        return null;
      }
    }
  } catch (error) {
    console.error("Token alınırken bir hata oluştu:", error);
    return null;
  }
};

const SendMessageNotification = async (
  useruid,
  senderusername,
  messagetext
) => {
  const receivertoken = await getExpoPushToken(useruid);
  if (!receivertoken) {
    console.log("Geçerli bir token bulunamadı, bildirim gönderilemiyor.");
    return;
  }
  const message = {
    to: receivertoken,
    sound: "default",
    title: `${senderusername} kişisinden mesajınız var`,
    body: messagetext,
    data: { someData: "goes here" },
  };
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([message]),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log("Notification sent:", responseData);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const SendPostLikeNotification = async (useruid, senderusername) => {
  console.log("senderusername" + senderusername);
  const receivertoken = await getExpoPushToken(useruid);
  console.log("receivertoken" + receivertoken);
  const message = {
    to: receivertoken,
    sound: "default",
    title: `${senderusername} gönderini beğendi`,
    body: "",
    data: { someData: "goes here" },
  };
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log("Notification sent:", responseData);
    } else {
      console.error("Failed to send notification:", responseData);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const SendPostCommentNotification = async (
  useruid,
  senderusername,
  comment
) => {
  const receivertoken = await getExpoPushToken(useruid);
  const message = {
    to: receivertoken,
    sound: "default",
    title: `${senderusername} gönderine yorum yaptı`,
    body: comment,
    data: { someData: "goes here" },
  };
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([message]),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log("Notification sent:", responseData);
    } else {
      console.error("Failed to send notification:", responseData);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const SendRequestNotification = async (useruid, senderusername) => {
  const receivertoken = await getExpoPushToken(useruid);
  if (!receivertoken) {
    console.log("Geçerli bir token bulunamadı, bildirim gönderilemiyor.");
    return;
  }
  console.log(receivertoken);
  const message = {
    to: receivertoken,
    sound: "default",
    title: `${senderusername} seni takip etmek istiyor`,
    body: "",
    data: { someData: "goes here" },
  };
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([message]),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log("Notification sent:", responseData);
    } else {
      console.error("Failed to send notification:", responseData);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const SendRequestAcceptedNotification = async (useruid, senderusername) => {
  const receivertoken = await getExpoPushToken(useruid);
  if (!receivertoken) {
    console.log("Geçerli bir token bulunamadı, bildirim gönderilemiyor.");
    return;
  }
  console.log(receivertoken);
  const message = {
    to: receivertoken,
    sound: "default",
    title: `${senderusername} takip isteğini kabul etti`,
    body: "",
    data: { someData: "goes here" },
  };
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([message]),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log("Notification sent:", responseData);
    } else {
      console.error("Failed to send notification:", responseData);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

/* const SendMessageNotification = async (
  receivertoken,
  senderusername,
  messagetext
) => {
  try {
    const Title = `${senderusername} size bir mesaj gönderdi`;
    await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: receivertoken,
      appId: 23219,
      appToken: "9bI6BBJvF01eIrM8FAoiPw",
      title: Title,
      message: messagetext,
    });
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const SendPostLikeNotification = async (receivertoken, senderusername) => {
  const Title = `${senderusername} gönderinizi beğendi`;
  await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
    subID: receivertoken,
    appId: 23219,
    appToken: "9bI6BBJvF01eIrM8FAoiPw",
    title: Title,
    message: "",
  });
};

const SendPostCommentNotification = async (
  receivertoken,
  senderusername,
  comment
) => {
  const Title = `${senderusername} gönderinize yorum yaptı`;
  await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
    subID: receivertoken,
    appId: 23219,
    appToken: "9bI6BBJvF01eIrM8FAoiPw",
    title: Title,
    message: comment,
  });
};

const SendRequestNotification = async (receivertoken, senderusername) => {
  const Title = `${senderusername} size takip isteği gönderdi`;
  await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
    subID: receivertoken,
    appId: 23219,
    appToken: "9bI6BBJvF01eIrM8FAoiPw",
    title: Title,
    message: "",
  });
};

const SendRequestAcceptedNotification = async (
  receivertoken,
  senderusername
) => {
  const Title = `${senderusername} takip isteğini kabul etti`;
  await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
    subID: receivertoken,
    appId: 23219,
    appToken: "9bI6BBJvF01eIrM8FAoiPw",
    title: Title,
    message: "",
  });
}; */

const CheckUpdates = async () => {
  try {
    const DocRef = db.collection("app").doc("update");
    const doc = await DocRef.get();

    if (doc.exists) {
      const data = doc.data();
      const version = data.version;
      const url = data.url;
      return { version, url };
    } else {
      console.log("Döküman bulunamadı");
    }
  } catch (error) {
    console.error("Versiyon bilgisi alınırken hata oluştu: ", error);
  }
};

export {
  auth,
  db,
  storage,
  SetNameSurname,
  SetUsername,
  SetBiography,
  SetFollowers,
  SetFollowings,
  SetMyPost,
  getAllPosts,
  getUserData,
  SetUserProfilePicture,
  SetMyPrivacy,
  getPost,
  DeleteMyPost,
  SetUser,
  LikePost,
  UnlikePost,
  AddFavorite,
  Deletefavorite,
  getRandomUserData,
  AddFollowing,
  DeleteFollowing,
  SetMessage,
  SetMessageWriting,
  updateMyPost,
  getMessages,
  SetPostMessage,
  SetComment,
  DeleteComment,
  AddFollowingRequest,
  DeleteFollowingRequest,
  AcceptRequest,
  RejectRequest,
  DeleteFollower,
  SendMessageNotification,
  SendPostLikeNotification,
  SendPostCommentNotification,
  CheckUpdates,
  SendRequestNotification,
  SendRequestAcceptedNotification,
  SetExpoPushToken,
  RemoveExpoPushToken,
  getExpoPushToken,
  DeleteNotification,
  CheckSignUp,
};
