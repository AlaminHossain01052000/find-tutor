
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword, getIdToken, deleteUser as firebaseDeleteUser, sendEmailVerification, RecaptchaVerifier, updatePassword } from "firebase/auth";
import { useEffect, useState } from "react";
import initializeFirebase from "../utilities/firebase.init";
import Swal from "sweetalert2";








initializeFirebase();
const useFirebase = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(false)
    const [token, setToken] = useState("");
    const auth = getAuth();

    // auth.languageCode = 'it';

    const registerNewUser = async (formData, userType, navigate) => {
        setLoading(true);
        setError(null);

        const { email, password } = formData;

        try {
            // 1. Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {

                // 3. Send email verification
                await sendEmailVerification(user);

                // 4. Send data to your backend
                if (userType === 'tutor') {
                    const response = await fetch("http://localhost:5000/api/teachers", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });

                    alert("Please Verify Your Email!");
                    await signOut(auth);

                    navigate('/login')
                }
                else {
                    const response = await fetch("http://localhost:5000/api/students", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });

                    alert("Please Verify Your Email!");
                    await signOut(auth);

                    navigate('/login')
                }

                // 5. Sign out user until email is verified

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

    const updateUserPassword = async (newPassword, navigate, teacherId, password, confirmPassword) => {
        try {
            const user = auth.currentUser;

            if (!user) throw new Error("User not authenticated");

            await updatePassword(user, newPassword);
            const updateBackendPassword = async (teacherId, password, confirmPassword) => {
                try {
                    const res = await fetch(`http://localhost:5000/api/teachers/update-password/${teacherId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password, confirmPassword }),
                    });

                    const result = await res.json();

                    if (!res.ok) throw new Error(result.error);
                    console.log(result.message);
                } catch (error) {
                    console.log(error)
                }

            };
            await updateBackendPassword(teacherId, password, confirmPassword);
            await logoutUser()
            navigate('/login')
            console.log("✅ Password updated successfully");
        } catch (error) {
            console.error("❌ Error updating password:", error.message);
        }
    };
    const updateStudentPassword = async (newPassword, navigate, studentId, password, confirmPassword) => {
        try {
            const user = auth.currentUser;

            if (!user) throw new Error("User not authenticated");

            await updatePassword(user, newPassword);
            const updateBackendPassword = async (studentId, password, confirmPassword) => {
                try {
                    const res = await fetch(`http://localhost:5000/api/students/update-password/${studentId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password, confirmPassword}),
                    });

                    const result = await res.json();

                    if (!res.ok) throw new Error(result.error);
                    console.log(result.message);
                } catch (error) {
                    console.log(error)
                }

            };
            await updateBackendPassword(studentId, password, confirmPassword);
            await logoutUser()
            navigate('/login')
            console.log("✅ Password updated successfully");
        } catch (error) {
            console.error("❌ Error updating password:", error.message);
        }
    };
    const logoutUser = async () => {
        setLoading(true);
        await signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            setError(error.message)
        })
            .finally(() => setLoading(false))
            ;
    }
    const deleteUser = async (email, role,id) => {
        setLoading(true);
        // console.log(email)
        if (email === undefined) {
            return
        }
        try {
            // Fetch user data to get user ID
            const url = role === "teacher"
                ? `http://localhost:5000/api/teachers/${id}`
                : `http://localhost:5000/api/students/${id}`;

            const res = await fetch(url, {
                method: "DELETE",
            });

            if (res.ok) {
                // Delete user from Firebase
                const userRecord = await auth.getUserByEmail(email);
                const deletedUser=await firebaseDeleteUser(userRecord);
                console.log("deleted user useFirebase",deletedUser)
                setUser((prevUsers) => prevUsers.filter(user => user.email !== email));
                Swal.fire("Deleted!", "User has been deleted.", "success");
                return res;
            } else {
                Swal.fire("Error!", "Something went wrong.", "error");
            }


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
                if (user.email === 'a@gmail.com') {
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
        deleteUser,
        updateUserPassword,
        updateStudentPassword

    }
}
export default useFirebase;