import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "utils/Context/Context";
import { IPost } from "utils/types";
import db from "../../../firebase";

export default function useAuthLayoutHook() {
  const auth = getAuth();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);
  const { inbox, setInbox } = useAppContext();

  let location = useLocation();
  const navigate = useNavigate();

  // navigate to specified path (useful in handling hotkey actions)
  const onClickLink = (path: string) => navigate(path);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    // Cleanup subscription
    return unsubscribe;
  }, [initializing, auth]);

  useEffect(() => {
    // fetch inbox by user uid
    let unsub;
    if (auth.currentUser) {
      unsub = onSnapshot(
        collection(db, "users", auth.currentUser!.uid, "inbox"),
        ({ docs }) => {
          setInbox(
            docs.map((doc) => ({
              ...(doc.data() as IPost),
            }))
          );
        }
      );
    }
    return unsub;
  }, [auth.currentUser, setInbox]);

  // sign out user
  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return { initializing, user, inbox, location, onClickLink, signOut };
}
