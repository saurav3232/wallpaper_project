import { createContext, useState} from "react";
export const MessageContext=createContext({
    messagesArr:[],
    setMessagesArr:()=>{},

})


export const MessageProvider=({children})=>{
    const [messagesArr,setMessagesArr]=useState([]);
    const value={messagesArr,setMessagesArr}
    return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}