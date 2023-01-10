import { createContext, useState,useEffect} from "react";
import { onAuthStateChangeListener } from "../utils/Firebase/Firebase.utils";
import { getUserData } from "../utils/Firebase/Firebase.utils";
export const NotificationContext=createContext({
    notificationsArr:[],
    setNotificationArr:()=>{},
    unReadMessages:[],
    setUnreadMessages:()=>{}
})


export const NotificationProvider=({children})=>{
    const [notificationsArr,setNotificationArr]=useState([]);
    const [unReadMessages,setUnreadMessages]=useState([]);
    useEffect(() => {
        const unsubscribe = onAuthStateChangeListener(async (user) => {
          if (user) {
            const userInfo=await getUserData(user.uid);
            var arr=[];
            userInfo.notifications.forEach((notification)=>{
                if(!notification.read)
                {
                    arr.push(notification);
                }
            })
            setNotificationArr(userInfo.notifications);
            setUnreadMessages(arr);
          }
        });
        return unsubscribe;
        // eslint-disable-next-line
      }, []);



    const value={notificationsArr,setNotificationArr,unReadMessages,setUnreadMessages}
    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}