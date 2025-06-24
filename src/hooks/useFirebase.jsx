
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword, getIdToken ,deleteUser as firebaseDeleteUser,sendEmailVerification, signInWithPhoneNumber,RecaptchaVerifier } from "firebase/auth";
import { useEffect, useState } from "react";
import initializeFirebase from "../utilities/firebase.init";
import axios from "axios";






initializeFirebase();
const useFirebase = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [admin,setAdmin]=useState(false)
    const [token, setToken] = useState("");
    const auth = getAuth();
    // auth.languageCode = 'it';

     const registerNewUser = async (formData, config) => {
    setLoading(true);
    setError(null);

    const { email, password } = formData;
    
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user) {
        // 2. Prepare FormData with all user information
        const formPayload = new FormData();
        
        // Append all form data
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            if (key === 'categories') {
              formPayload.append(key, JSON.stringify(value));
            } else if (value instanceof File) {
              formPayload.append(key, value);
            } else {
              formPayload.append(key, value);
            }
          }
        });

        // Add Firebase UID and additional fields
        formPayload.append('uid', user.uid);
        formPayload.append('isEmailVerified', 'false');
        
        if (formData.userType === 'teacher') {
          formPayload.append('balance', '0');
          formPayload.append('ratings', '0');
          formPayload.append('isRatedYet', 'false');
          formPayload.append('isApproved', 'false');
        }

        // 3. Send email verification
        await sendEmailVerification(user);
        
        // 4. Send data to your backend
        await axios.post('http://localhost:5000/api/users', formPayload, {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data'
          }
        });

        // 5. Sign out user until email is verified
        await signOut(auth);
        return true; // Indicate success
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };


    const loginUser = async (email, password, navigate) => {
        setLoading(true);
        setError("");
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // if(!user.emailVerified){
            //     await signOut(auth);
            //     alert("You have to verify your email. Please check your email.");
            //     await sendEmailVerification(user);
            // }
            // else{
            //     navigate('/')
            // }
            navigate('/')
            // navigate('/')
    
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
   
    const logoutUser = () => {
        setLoading(true);
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            setError(error.message)
        })
            .finally(() => setLoading(false))
            ;
    }
    const deleteUser = async (email) => {
        setLoading(true);
        console.log(email)
        if(email===undefined){
            return
        }
        try {
            // Fetch user data to get user ID
            const response = await axios.get(`http://localhost:5001/users/single?email=${email}`);
            const userToDelete = response.data;

            if (!userToDelete) {
                throw new Error("User not found in local database");
            }
            console.log(userToDelete)

            // Delete user from local database
            await axios.delete(`http://localhost:5001/users/${userToDelete._id}`);

            // Delete user from Firebase
            const userRecord = await auth.getUserByEmail(email);
            await firebaseDeleteUser(userRecord);

            setUser((prevUsers) => prevUsers.filter(user => user.email !== email));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
            // if (user&&user?.emailVerified) {
            if (user) {
                
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User

                setUser(user);
                // console.log(user.email)?
                if(user.email==='a@gmail.com'){
                    setAdmin(true)
                }
                else setAdmin(false)
                getIdToken(user)
                    .then(idToken => {
                        setToken(idToken);
                    })
            } else {
                // When User is signed out

                setUser({})
            }
            setLoading(false);
        });
        
    }, [auth])
    return {
        user,
    
        registerNewUser,
        admin,
        logoutUser,
        loginUser,
        loading,
        error,
        token,
        deleteUser
       
    }
}
export default useFirebase;