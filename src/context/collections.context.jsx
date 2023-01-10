import { createContext, useState } from "react";

export const CollectionsContext = createContext({
    collection_imageUrl:"",
    togglePopUpVal:"",
    setTogglePopUpVal:()=>{},
    popUpDiscard:"",
    setPopUpDiscard:()=>{}
  });

export const CollectionsProvider=({children})=>{
    const [collection_imageUrl,setCollectionImageUrl]=useState("");
    const [togglePopUpVal,setTogglePopUpVal]=useState(false);
    const value={collection_imageUrl,setCollectionImageUrl,togglePopUpVal,setTogglePopUpVal};
    return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}