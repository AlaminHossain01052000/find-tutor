import { useContext } from "react"
import { AuthContext } from "../shared/AuthProvider/AuthProvider";





const useAuth = () => {
    return useContext(AuthContext);
}
export default useAuth;