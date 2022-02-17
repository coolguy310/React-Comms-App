import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "utils/Context/Context";
import { IPost } from "utils/types";
import db from "../../../firebase";
import { useKeyPress } from "utils/Hooks/useKeyPress";

export default function useAuthLayoutHook() {
  const auth = getAuth();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);
  const { inbox, setInbox, activeSection, setActiveSection } = useAppContext();
  const enterPress = useKeyPress("Enter");
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const downPress = useKeyPress("ArrowDown");

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
        query(
          collection(db, "users", auth.currentUser!.uid, "inbox"),
          where("done", "==", false),
          where("triagedUntil", "==", null)
        ),
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

  // If Enter is pressed and inbox button is active, navigate to inbox
  useEffect(() => {
    if (enterPress && activeSection === "inbox") {
      navigate("/");
    }
  }, [enterPress, activeSection, navigate]);

  // Switch active sections when left or right arrow keys are pressed

  useEffect(() => {
    if (leftPress) {
      setActiveSection("inbox");
    }
  }, [leftPress, location.pathname, setActiveSection]);

  useEffect(() => {
    if (rightPress) {
      setActiveSection(location.pathname);
    }
  }, [location.pathname, rightPress, setActiveSection]);

  useEffect(() => {
    if (downPress && activeSection === "inbox") {
      setActiveSection("channels");
    }
  }, [downPress, location.pathname, activeSection, setActiveSection]);

  return { initializing, user, inbox, location, onClickLink, signOut };
}
