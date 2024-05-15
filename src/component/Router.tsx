import { Navigate, useRoutes } from "react-router-dom";
import { auth } from "../Firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import Login from "./Login";
import Home from "./Home";
import Detail from "./Detail";
import Meeting from "./Meeting";
import { useCallback, useEffect, useState } from "react";

const Router = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const blockBrowserBack = useCallback(() => {
    alert("ブラウザバックは禁止されています。ボタンクリックで戻ってください。");
    window.history.go(1);
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBrowserBack);

    return () => {
      window.removeEventListener("popstate", blockBrowserBack);
    };
  }, [blockBrowserBack]);

  const routingConfig = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: user ? <Home /> : <Navigate to="/login" />,
    },
    {
      path: "/detail/:id",
      element: user ? <Detail /> : <Navigate to="/login" />,
    },
    {
      path: "/detail/:id/Meeting",
      element: user ? <Meeting /> : <Navigate to="/login" />,
    },
    {
      path: "/detail/:id/Meeting/:index",
      element: user ? <Meeting /> : <Navigate to="/login" />,
    },
    // { path: '*', element: <NotFound /> }
  ];

  const routing = useRoutes(routingConfig);

  return routing;
};

export default Router;
