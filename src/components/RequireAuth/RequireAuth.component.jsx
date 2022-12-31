import { UserContext } from "../../context/user.context"
import { useContext } from "react"
import { Navigate } from "react-router-dom";
export const RequireAuth = ({children}) => {
  const {currentUser}=useContext(UserContext);
  if(!currentUser)
  {
    return <Navigate to='/signin'/>
  }  
  return children
}
