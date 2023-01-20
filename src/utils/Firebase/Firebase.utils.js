import { initializeApp } from "firebase/app";
import { v4 } from "uuid";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCZJQ_bgIuTe8m-zy75XfZBclxGo1gTAng",
  authDomain: "wallpaper-project-e1c7d.firebaseapp.com",
  projectId: "wallpaper-project-e1c7d",
  storageBucket: "wallpaper-project-e1c7d.appspot.com",
  messagingSenderId: "362303478151",
  appId: "1:362303478151:web:7bd3e0fe682a24883fdb22",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
export const auth = getAuth();
export const signInWithGooglePopup = () => {
  return signInWithPopup(auth, googleProvider);
};

export const db = getFirestore();
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    const collections = [];
    const likedWallpapers = [];
    const dislikedWallpapers = [];
    const myWallpapers = [];
    const following = [];
    const followedBy = [];
    const views = 0;
    const profileImage = "";
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        collections,
        likedWallpapers,
        dislikedWallpapers,
        myWallpapers,
        following,
        followedBy,
        views,
        profileImage,
        facebookId: "",
        instagramId: "",
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  return userDocRef;
};
export const addImageLinktoDb = async (imageDoc) => {
  const createdAt = new Date();
  const likes = 0,
    dislikes = 0;
  try {
    const { imageUrl, userId, category } = imageDoc;
    const imageDocRef = doc(db, "images", category);
    const imageSnapshot = await getDoc(imageDocRef);
    const imageObj = {
      ...imageDoc,
      createdAt,
      likes,
      dislikes,
      imageId: v4(),
      comments: [],
      imageViews:0,
    };
    const obj = {
      arr: [],
    };
    if (!imageSnapshot.exists()) {
      await setDoc(imageDocRef, obj);
      await getDoc(doc(db, "images", category)).then((res) => {
        updateDoc(imageDocRef, {
          arr: [...res.data().arr, imageObj],
        });
        console.log(res.data());
      });
    } else {
      // await setDoc(imageDocRef,{...imageSnapshot.data(),imageObj});
      console.log(imageSnapshot.data().arr);
      const newArr = [...imageSnapshot.data().arr, imageObj];
      await updateDoc(imageDocRef, {
        arr: newArr,
      });
      console.log("image exists");
    }
    alert("Added the image to your DB");
    const userDocRef = doc(db, "users", userId);
    await getUserData(userId).then((res) => {
      updateDoc(userDocRef, {
        myWallpapers: [...res.myWallpapers, imageUrl],
      });
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getCategoriesAndDocument = async () => {
  const collectionRef = collection(db, "images");
  const alldocs = await getDocs(collectionRef);
  let categoryMap = [];
  alldocs.forEach((doc) => {
    // console.log( doc.id, doc.data().arr);
    // categoryMap.set(doc.id,doc.data().arr)
    categoryMap = [...categoryMap, { category: doc.id, arr: doc.data().arr }];
  });
  return categoryMap;
};

export const getSpecificCategory =async(category)=>{
  const docSnapShot=await getDoc(doc(db,"images",category));
  return docSnapShot.data().arr;
}

export const getLikeCount = async (category, imageId) => {
  const imageSnapshot = await getDoc(doc(db, "images", category));
  imageSnapshot.data().arr.forEach((imgObj) => {
    if (imgObj.imageId === imageId) {
      // console.log(imgObj.likes)
      return imgObj.likes;
    }
  });
};
export const getdisLikeCount = async (category, imageId) => {
  const imageSnapshot = await getDoc(doc(db, "images", category));
  imageSnapshot.data().arr.forEach((imgObj) => {
    if (imgObj.imageId === imageId) {
      // console.log(imgObj.likes)
      return imgObj.dislikes;
    }
  });
};

export const updateImageViews = async (imageObj, createrId) => {
  const imageInfo = await getImageInfo(imageObj);
  const { category } = imageObj;
  const imageRef = doc(db, "images", category);
  const createrRef = doc(db, "users", createrId);
  const createrSnapShot = await getUserData(createrId);
  imageInfo.arr.map((image, idx) =>
    image.imageUrl === imageObj.imageUrl
      ? (image.imageViews = image.imageViews + 1)
      : image.imageViews
  );
  await updateDoc(imageRef, {
    arr: imageInfo.arr,
  });
  await updateDoc(createrRef, {
    views: createrSnapShot.views + 1,
  });
};

export const getCommentsArray = async (imageCategory, imageId) => {
  const imageSnapshot = await getDoc(doc(db, "images", imageCategory));
  const getObj = imageSnapshot
    .data()
    .arr.find((obj) => obj.imageId === imageId);
  return getObj.comments;
};

export const addCommentsToDb = async (imageCategory, imageId, commentObj,createrId,currentUrl) => {
  const imageSnapshot = await getDoc(doc(db, "images", imageCategory));
  const modArray = [...imageSnapshot.data().arr];
  const notificationObj = {
    message: `${commentObj.createdBy} added a comment at ${currentUrl}`,
    notificationId: v4(),
    read: false,
  };
  modArray.forEach((imageObj) => {
    if (imageObj.imageId === imageId) {
      imageObj.comments = [...imageObj.comments, commentObj];
    }
  });
  await updateDoc(doc(db, "images", imageCategory), {
    arr: modArray,
  });
  await updateDoc(doc(db,"users",createrId),{
    notifications:arrayUnion(notificationObj)
  })
};

export const deleteCommentsFromDb = async (
  imageCategory,
  commentId
) => {
  const imageSnapshot = await getDoc(doc(db, "images", imageCategory));
  const modArray = [...imageSnapshot.data().arr];
  modArray.forEach((obj) => {
    obj.comments = obj.comments.filter(
      (comment) => comment.commentId !== commentId
    );
  });

  // console.log(modArray);
  await updateDoc(doc(db,"images",imageCategory),{
    arr:modArray
  })
};

export const setProfileImageHandler = async (currentUser, profileImageLink) => {
  console.log("function called");
  const uid = currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef, {
      profileImage: profileImageLink,
    });
  } catch (error) {
    console.log(error);
  }
};
export const changeInstagramLink = async (currentUser, InstagramLink) => {
  const uid = currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef, {
      instagramId: InstagramLink,
    });
  } catch (error) {
    console.log(error);
  }
};
export const changeFacebookLink = async (currentUser, FacebookLink) => {
  const uid = currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef, {
      facebookId: FacebookLink,
    });
  } catch (error) {
    console.log(error);
  }
};
export const changeDisplayName = async (currentUser, name) => {
  const uid = currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef, {
      displayName: name,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getUserData = async (uid) => {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.data();
};
export const checkLikedImage = async (currentUser, imageUrl) => {
  if (currentUser === null) {
    return false;
  }
  let flag = false;
  await getUserData(currentUser.uid).then((res) => {
    if (res.likedWallpapers.includes(imageUrl)) {
      flag = true;
    }
  });
  // console.log(flag)
  return flag;
};

export const checkdisLikedImage = async (currentUser, imageUrl) => {
  if (currentUser === null) {
    return false;
  }
  let flag = false;
  await getUserData(currentUser.uid).then((res) => {
    if (res.dislikedWallpapers.includes(imageUrl)) {
      flag = true;
    }
  });
  // console.log(flag)
  return flag;
};

export const getImageInfo = async (imageObj) => {
  const { category } = imageObj;
  const snapShot = await getDoc(doc(db, "images", category));
  return snapShot.data();
};

export const getSpecificImageInfo = async (category, imageId) => {
  const snapShot = await getDoc(doc(db, "images", category));
  return snapShot.data().arr.find((imgObj) => {
    return imgObj.imageId === imageId;
  });
};
export const toggleLikeValueDb = async (currentUser, imageObj, likevalue) => {
  const uid = currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  likevalue = !likevalue;
  const imageUrl = imageObj.imageUrl;
  if (likevalue) {
    // console.log("first part")
    try {
      await getUserData(uid).then((res) => {
        updateDoc(userDocRef, {
          likedWallpapers: [...res.likedWallpapers, imageUrl],
        });
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    // console.log("Second part")
    await getUserData(uid).then((res) => {
      // console.log(res);
      const index = res.likedWallpapers.indexOf(imageUrl);
      res.likedWallpapers.splice(index, 1);
      updateDoc(userDocRef, {
        likedWallpapers: res.likedWallpapers,
      });
    });
  }
  await updateLikeCountImage(imageObj, likevalue);
};

export const updateLikeCountImage = async (imageObj, likeVal) => {
  // console.log(likeVal);
  const { category, imageUrl } = imageObj;
  const DocRef = doc(db, "images", category);
  await getImageInfo(imageObj).then((res) => {
    res.arr.map((obj, idx) =>
      obj.imageUrl === imageUrl
        ? likeVal
          ? (obj.likes = obj.likes + 1)
          : (obj.likes = obj.likes - 1)
        : obj.likes
    );
    updateDoc(DocRef, {
      arr: res.arr,
    });
  });
};

export const toggledisLikeValueDb = async (
  currentUser,
  imageObj,
  dislikevalue
) => {
  const uid = currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  dislikevalue = !dislikevalue;
  const imageUrl = imageObj.imageUrl;
  if (dislikevalue) {
    // console.log("first part")
    try {
      await getUserData(uid).then((res) => {
        updateDoc(userDocRef, {
          dislikedWallpapers: [...res.dislikedWallpapers, imageUrl],
        });
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    // console.log("Second part")
    await getUserData(uid).then((res) => {
      // console.log(res);
      const index = res.likedWallpapers.indexOf(imageUrl);
      res.dislikedWallpapers.splice(index, 1);
      updateDoc(userDocRef, {
        dislikedWallpapers: res.dislikedWallpapers,
      });
    });
  }
  await updatedisLikeCountImage(imageObj, dislikevalue);
};

export const updatedisLikeCountImage = async (imageObj, dislikeVal) => {
  // console.log(dislikeVal);
  const { category, imageUrl } = imageObj;
  const DocRef = doc(db, "images", category);
  await getImageInfo(imageObj).then((res) => {
    res.arr.map((obj, idx) =>
      obj.imageUrl === imageUrl
        ? dislikeVal
          ? (obj.dislikes = obj.dislikes + 1)
          : (obj.dislikes = obj.dislikes - 1)
        : obj.dislikes
    );
    updateDoc(DocRef, {
      arr: res.arr,
    });
  });
};

export const checkImageInCollections = async (uid, imageUrl) => {
  // console.log("Inside checkCollection Image");
  var flag = false;
  const userSnapshot = await getUserData(uid);
  userSnapshot.collections.forEach((collectionObj) => {
    if (collectionObj.arr.includes(imageUrl)) {
      flag = true;
    }
  });
  return flag;
};

export const updateCollections = async (uid, imageUrl, collectionTitle) => {
  const UserDocRef = doc(db, "users", uid);
  const userSnapshot = await getUserData(uid);
  var flag = false;
  userSnapshot.collections.forEach((collectionObj) => {
    if (collectionObj.title === collectionTitle) {
      if (!collectionObj.arr.includes(imageUrl)) {
        collectionObj.arr.push(imageUrl);
      }
      flag = true;
    }
  });
  if (!flag) {
    const newObj = {
      title: collectionTitle,
      arr: [imageUrl],
    };
    await updateDoc(UserDocRef, {
      collections: [...userSnapshot.collections, newObj],
    });
  } else {
    await updateDoc(UserDocRef, {
      collections: [...userSnapshot.collections],
    });
  }
};

export const removeFromCollection = async (uid, imageUrl) => {
  const UserDocRef = doc(db, "users", uid);
  const userSnapshot = await getUserData(uid);
  const emptyCollections = [];
  userSnapshot.collections.forEach((collectionObj) => {
    if (collectionObj.arr.includes(imageUrl)) {
      // console.log("include imageUrl")
      const idx = collectionObj.arr.indexOf(imageUrl);
      collectionObj.arr.splice(idx, 1);
    }
    if (collectionObj.arr.length === 0) {
      const i = userSnapshot.collections.indexOf(collectionObj);
      emptyCollections.push(i);
    }
  });
  emptyCollections.forEach((idx) => {
    userSnapshot.collections.splice(idx, 1);
  });
  await updateDoc(UserDocRef, {
    collections: [...userSnapshot.collections],
  });
};

export const addNotificationOnLike = async (
  currentUserUid,
  createrUid,
  imageObj
) => {
  console.log(imageObj)
  const createrDoc = doc(db, "users", createrUid);
  const userSnapShot = await getUserData(currentUserUid);
  const category=imageObj.category;
  const imageId=imageObj.imageId;
  const notificationObj = {
    message: `${userSnapShot.displayName} Liked Your Image at :http://localhost:3000/image/${category}/${imageId}`,
    notificationId: v4(),
    read: false,
  };
  await updateDoc(createrDoc, {
    notifications: arrayUnion(notificationObj),
  });
};

export const addToFollowedBy = async (currentUserUid, targetUid) => {
  const UserDocRef = doc(db, "users", targetUid);
  const userSnapShot = await getUserData(targetUid);
  const follower = await getUserData(currentUserUid);
  const notificationObj = {
    message: `${follower.displayName} Followed You`,
    notificationId: v4(),
    read: false,
  };
  userSnapShot.followedBy.push(currentUserUid);
  await updateDoc(UserDocRef, {
    followedBy: [...userSnapShot.followedBy],
    notifications: [...userSnapShot.notifications, notificationObj],
  });
};

export const removeFromFollwedBy = async (currentUserUid, targetUid) => {
  const UserDocRef = doc(db, "users", targetUid);
  const userSnapShot = await getUserData(targetUid);
  const follower = await getUserData(currentUserUid);
  const notificationObj = {
    message: `${follower.displayName} UnFollowed You`,
    notificationId: v4(),
    read: false,
  };
  var idx;
  userSnapShot.followedBy.forEach((user, id) => {
    if (currentUserUid === user) {
      idx = id;
    }
  });
  userSnapShot.followedBy.splice(idx, 1);
  // console.log(userSnapShot.following);
  await updateDoc(UserDocRef, {
    followedBy: [...userSnapShot.followedBy],
    notifications: [...userSnapShot.notifications, notificationObj],
  });
};

export const addToFollowingHandler = async (
  currentUserUid,
  targetUid,
  userSnapShot
) => {
  const UserDocRef = doc(db, "users", currentUserUid);
  userSnapShot.following.push(targetUid);
  await updateDoc(UserDocRef, {
    following: [...userSnapShot.following],
  });
  await addToFollowedBy(currentUserUid, targetUid);
};
export const removeFromFollowingHandler = async (
  currentUserUid,
  targetUid,
  userSnapShot
) => {
  const UserDocRef = doc(db, "users", currentUserUid);
  var idx;
  userSnapShot.following.forEach((user, id) => {
    if (targetUid === user) {
      idx = id;
    }
  });
  userSnapShot.following.splice(idx, 1);
  await updateDoc(UserDocRef, {
    following: [...userSnapShot.following],
  });
  await removeFromFollwedBy(currentUserUid, targetUid);
};

export const removeFromUnreadHandler = async (
  notification,
  setNotificationArr,
  uid,
  unReadMessages
) => {
  const UserDocRef = doc(db, "users", uid);
  const userSnapShot = await getUserData(uid);
  userSnapShot.notifications.forEach((notifi, idx) => {
    if (
      notifi.message === notification.message &&
      notifi.notificationId === notification.notificationId
    ) {
      notifi.read = true;
      unReadMessages.splice(idx, 1);
    }
  });
  // console.log(unReadMessages)
  // userSnapShot.notifications.splice(id,1);
  await updateDoc(UserDocRef, {
    notifications: userSnapShot.notifications,
  });
  setNotificationArr(userSnapShot.notifications);
  // alert("Remove from Unread")
  return unReadMessages;
};

export const clearNotifications = async (uid, setNotificationArr) => {
  const UserDocRef = doc(db, "users", uid);
  await updateDoc(UserDocRef, {
    notifications: [],
  });
  setNotificationArr([]);
};

export const collectImageObjects = async (uid) => {
  var arr = [];
  const categoryMap = await getCategoriesAndDocument();
  // console.log(categoryMap);
  categoryMap.forEach((category, idx) => {
    category.arr.forEach((cat, idx) => {
      if (cat.userId === uid) {
        arr.push(cat);
      }
    });
  });
  // console.log(arr);
  return arr;
};

export const addUserReceipentMessage = async (messageRefId) => {
  const MessageDocRef = doc(db, "chats", messageRefId);
  const MessageSnapshot = await getDoc(MessageDocRef);
  const createdAt = new Date();
  const messageId = v4();
  const messageObj = {
    messages: [],
    createdAt,
    messageId,
  };
  if (!MessageSnapshot.exists()) {
    await setDoc(MessageDocRef, messageObj);
  }
  return MessageSnapshot.messages;
};

export const addChatsToDb = async (
  messageRefId,
  chat,
  currentUserUid,
  targetId
) => {
  let currentDate = new Date();
  const createdAt = currentDate.toJSON().slice(0, 10);
  let createdTime = currentDate.getHours() + ":" + currentDate.getMinutes();
  const chatObj = {
    chat: chat,
    sender: currentUserUid,
    createdAt,
    createdTime,
  };
  const targetUserRef = doc(db, "users", targetId);
  const currentUserSnapShot = await getDoc(doc(db, "users", currentUserUid));
  const notificationObj = {
    message: `${
      currentUserSnapShot.data().displayName
    } sent you a message,You can view it at:
    http://localhost:3000/creater/${currentUserUid}/message`,
    notificationId: v4(),
    read: false,
  };
  await updateDoc(targetUserRef, {
    notifications: arrayUnion(notificationObj),
  });
  await updateDoc(doc(db, "chats", messageRefId), {
    messages: arrayUnion(chatObj),
  });
};


export const getQueryImage=async(queryImage)=>{
  const collectionRef= collection(db,"images");
  // console.log(queryImage);
  const imageDbSnapshot=await getDocs(collectionRef);
  var output=[];
  imageDbSnapshot.docs.forEach((doc)=>{
    doc.data().arr.forEach((imageObj,idx)=>{
      if(imageObj.category===queryImage || imageObj.tagArray.includes(queryImage))
      {
        output.push(imageObj);
      }
    })
  })
  return output;
} 







export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};
export const signOutUser = async () => {
  await signOut(auth);
};
export const onAuthStateChangeListener = (callback) => {
  onAuthStateChanged(auth, callback);
};
