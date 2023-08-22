import { createContext, useState, useCallback, useEffect } from "react";
import { loginService, refreshTokenService, signupService} from "../../api/apiServices";
import { notify } from "../../utils/utils";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [isAuthenticated, setIsAutheticated] = useState(false);
/*
  // Atualiza o token do usuário logado
  const refreshTokenValidate = useCallback(() => {
    if (refreshToken !== null && token !== null) {
      refreshTokenService(token)
        .then(async (response) => {
          console.log(response);
          if (response.ok) {
            const data = await response.json();
            // Atualiza o refreshToken no estado e também salva no localStorage
            setRefreshToken(data.token);
          } else {
            
            // Se a resposta não estiver ok, o refreshToken expirou ou é inválido.
            // Nesse caso, limpa o token no estado
            setToken(null);
          }
          // A cada 5 min faz uma solicitação nova
          setTimeout(refreshToken, 5 * 60 * 1000)
        })
        .catch((error) => {
          setToken(null);
          console.error("Erro ao renovar token:", error);
        });
    }
    }, [token]);
  
    useEffect(() => {

      refreshTokenValidate()
  
    }, [refreshTokenValidate])
*/
  const signupSubmitHandler = ({ firstName = "", lastName = "", gender = "", dayBday="", monthBday="", yearBday="", email = "", password = "" }) => {
    setSigningUp(true);
    const genericErrorMessage = "Algo deu errado. Tente novamente!"
    signupService (firstName,lastName,gender,dayBday,monthBday,yearBday,email,password)
    .then(async response => {
      if (!response.ok) {
        if (response.status === 400) {
          notify("warn","Algo errado, verifique o preenchimento!")

        } else if (response.status === 401) {
          notify("warn","Email ou senha inválida!")

        } else if (response.status === 500) {
          const data = await response.json()
          if (data.message){
            notify("error",data.message || genericErrorMessage)
          } 
        } else {
          notify("error",genericErrorMessage)
        }
      } else {
        const data = await response.json()
        localStorage.setItem("token", data.token);
        var user_sign = {'firstName':firstName, 'lastName': lastName, 'dayBday': dayBday, 'monthBday': monthBday, 'yearBday': yearBday, 'email': email, 'createdAt':data.createdAt}
        localStorage.setItem(
          "userInfo",
          JSON.stringify(user_sign)
        );
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setIsAutheticated(true);
        notify("success", "Registrado com sucesso!");
      }
    })
    .catch (function (error){
      console.log(error);
        notify(
          "error",
          error?.response?.data?.errors
            ? error?.response?.data?.errors[0]
            : genericErrorMessage
          )
        
    })
    .finally(() =>{
      setSigningUp(false);
    })
};

  const loginHandler = ({ email = "", password = "" }) => {
    setLoggingIn(true);
    const genericErrorMessage = "Algo deu errado. Tente novamente!"
    loginService(email,password)
    .then(async response => {
      if (!response.ok) {
        if (response.status === 400) {
          notify("warn","Algo errado, verifique o preenchimento!")
        } else if (response.status === 401) {
          notify("warn","Email ou senha inválida!");
        } else {
          notify("error",genericErrorMessage);
        }
      } else {
        const data = await response.json()
        var user_sign = {'firstName':data.firstName, 'lastName': data.lastName, 'email': email, 'updatedAt':data.updatedAt}
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(user_sign)
        );
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setIsAutheticated(true);
        notify("success", "Autenticado com sucesso!");
      }
    })
    .catch (function (error){
      console.log(error);
        notify(
          "error",
          error?.response?.data?.errors
            ? error?.response?.data?.errors[0]
            : genericErrorMessage
          )
        
    })
    .finally(() =>{
      setLoggingIn(false);
    })
};

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setToken(null);
    setIsAutheticated(false);
    notify("info", "Desconectado!", 100);
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        //refreshToken,
        loggingIn,
        loginHandler,
        logoutHandler,
        signupSubmitHandler,
        signingUp,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;