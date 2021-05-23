import React, { FormEvent, ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import debounce from 'lodash.debounce'

export default function EnterPage({ }) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ?
        !username ? <UsernameForm /> : <SignOutButton />
        :
        <SignInButton />
      }
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return (
    <button onClick={() => auth.signOut()}>
      Sign Out
    </button>
  )
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName, 
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  }

  const checkUsername = useCallback(debounce(
    async (username: string, setIsValid: Function, setLoading: Function) => {
    if (username.length > 3) {
      setLoading(true);
      const ref = firestore.doc(`usernames/${username}`);
      const { exists } = await ref.get();
      console.log('Firestore read executed!');
      setIsValid(!exists);
      setLoading(false);
    }
  }, 500), []);

  useEffect(() => {
    checkUsername(formValue, setIsValid, setLoading);
  }, [formValue]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setFormValue(val);
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>

          <input 
            name="username" 
            placeholder="username" 
            type="text" 
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug</h3>
          <div>
            <p>Username: {formValue}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Valid: {isValid.toString()}</p>
          </div>

        </form>
      </section>
    )
  );
}

type MessageProps = {
  username: string,
  isValid: boolean,
  loading: boolean
};

function UsernameMessage(props: MessageProps): JSX.Element {
  if (props.loading) {
    return <p>Checking...</p>
  }
  if (props.isValid) {
    return <p className="text-success">{props.username} is valid</p>
  }
  if (props.username && !props.isValid) {
    return <p className="text-danger">Username <strong>{props.username}</strong> is taken!</p>
  }
  return <p></p>
}