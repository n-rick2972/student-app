import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const logout = async () => {
    const confirmed = window.confirm("本当にログアウトしますか？");

    if (confirmed) {
      await signOut(auth);
      navigate("/login");
    }
  };

  const rewriteUserName = (value: string | null) => {
    if (value === "natunatu_f0729@yahoo.co.jp") {
      return "管理者";
    } else if (value === "test@gmail.com") {
      return "テスト";
    }
    return "";
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
        <div className="flex login-status">
          <p>ユーザー: {user && rewriteUserName(user.email)}さん</p>
          <button onClick={logout} className="action-btn">
            ログアウト
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
