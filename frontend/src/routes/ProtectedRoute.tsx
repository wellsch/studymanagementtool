import { useNavigate } from "react-router-dom";
import { ReactNode, useCallback, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { setEmail, setUsername, setId } = useContext(UserContext);

  const getUserDetails = useCallback(
    async (accessToken: string | undefined) => {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      const data = await response.json();
      setUsername(data.name);
      setEmail(data.email);
      const URI = `${import.meta.env.VITE_API_URI}/login`;
      const idData = await fetch(URI, {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then((resp) => resp.json());
      setId(idData.user_id);
    },
    [setEmail, setId, setUsername]
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
