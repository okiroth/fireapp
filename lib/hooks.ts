import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

type UserData = {
  user: object,
  username: string,
}

export function useUserData(): UserData {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
  // turn off realtime subscription
  let unsubscribe;

  if (user) {
    const ref = firestore.collection('users').doc(user.uid);
    unsubscribe = ref.onSnapshot((doc) => {
      setUsername(doc.data()?.username)
    });
  } else {
    setUsername(null);
  }

  return unsubscribe;
  }, [user]);

  return { user, username };
}