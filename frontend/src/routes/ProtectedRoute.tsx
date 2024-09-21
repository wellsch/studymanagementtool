import { useNavigate } from "react-router-dom";
import { ReactNode, useCallback, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { setEmail, setUsername } = useContext(UserContext);

  const getUserDetails = useCallback(
    async (accessToken: string | undefined) => {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      const data = await response.json();
      console.log(data);
      setUsername(data.name);
      setEmail(data.email);
    },
    [setEmail, setUsername]
  );

  useEffect(() => {
    const accessToken = sessionStorage.getItem("token");
    console.log(accessToken);

    if (!accessToken) navigate("/login");
    else getUserDetails(accessToken);
  }, [getUserDetails, navigate]);

  return <>{children}</>;
}

export default ProtectedRoute;
