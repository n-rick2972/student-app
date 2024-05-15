import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../Firebase";
import { Navigate } from "react-router-dom";
import "../assets/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      alert("メールアドレスまたはパスワードが間違っています");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <Navigate to={`/`} />
      ) : (
        <div className="flex login">
          <div className="login-form">
            <h2>ユーザーログイン</h2>
            <form className="form-contents" onSubmit={handleSubmit}>
              <div className="mail">
                <label>メールアドレス</label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="password">
                <label>パスワード</label>
                <input
                  name="password"
                  type="password"
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                  }}
                />
              </div>
              <button className="action-btn">ログイン</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
