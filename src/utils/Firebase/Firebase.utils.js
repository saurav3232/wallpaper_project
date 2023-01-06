import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection,getDocs} from "firebase/firestore";
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
export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    const collections = [];
    const likedWallpapers = [];
    const myWallpapers = [];
    const following = [];
    const followedBy = [];
    const views = 0;
    const profileImage="";
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        collections,
        likedWallpapers,
        myWallpapers,
        following,
        followedBy,
        views,
        profileImage,
        facebookId:"",
        instagramId:"",
        ...additionalInformation
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  return userDocRef;
};
export const addImageLinktoDb = async (imageDoc) => {
  const createdAt = new Date();
  const likes = 0, dislikes = 0;
  try {
    const {imageUrl,userId,category}=imageDoc;
    const imageDocRef = doc(db, "images", category);
    const imageSnapshot=await getDoc(imageDocRef);
    const imageObj={
      ...imageDoc,
      createdAt,
      likes,
      dislikes,
    }
    const obj={
      arr:[]
    };
    if(!imageSnapshot.exists())
    {
      await setDoc(imageDocRef,obj);
      await getDoc(doc(db, "images", category)).then((res)=>{
        updateDoc(imageDocRef,{
          arr:[...res.data().arr,imageObj]
        })
        console.log(res.data());
      })
    }
    else
    {
      // await setDoc(imageDocRef,{...imageSnapshot.data(),imageObj});
      console.log(imageSnapshot.data().arr);
      const newArr=[...imageSnapshot.data().arr,imageObj];
      await updateDoc(imageDocRef,{
        arr:newArr
      })
      console.log("image exists");
    }
    alert("Added the image to your DB")
    const userDocRef = doc(db, "users", userId);
    await getUserData(userId).then((res)=>{
       updateDoc(userDocRef,{
        myWallpapers:[...res.myWallpapers,imageUrl]
       })
    })

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const getCategoriesAndDocument=async()=>{
  const collectionRef=collection(db,'images');
  const alldocs=await getDocs(collectionRef);
  let categoryMap=[];
  alldocs.forEach((doc)=>{
    // console.log( doc.id, doc.data().arr);
    // categoryMap.set(doc.id,doc.data().arr)
    categoryMap=[...categoryMap,{category:doc.id,arr:doc.data().arr}];

  })
  return categoryMap;
}

export const setProfileImageHandler=async(currentUser,profileImageLink)=>{
  console.log("function called");
  const uid=currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef,{
      profileImage:profileImageLink
    })
  } catch (error) {
    console.log(error);
  }
}
export const changeInstagramLink=async(currentUser,InstagramLink)=>{
  const uid=currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef,{
      instagramId:InstagramLink
    })
  } catch (error) {
    console.log(error);
  }
}
export const changeFacebookLink=async(currentUser,FacebookLink)=>{
  const uid=currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef,{
      facebookId:FacebookLink
    })
  } catch (error) {
    console.log(error);
  }
}
export const changeDisplayName=async(currentUser,name)=>{
  const uid=currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef,{
      displayName:name
    })
  } catch (error) {
    console.log(error);
  }
}
export const getUserData=async(uid)=>{
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.data();
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
}
export const onAuthStateChangeListener = (callback) => {
  onAuthStateChanged(auth, callback);
}