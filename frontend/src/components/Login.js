import { useNavigate } from "react-router-dom";

import AuthForm from "./AuthForm";
import * as Auth from '../utils/Auth';

const Login = ({ handleLogin }) => {

  const navigate = useNavigate();

  const onSubmitAuthorize = (password, email) => {
    Auth.authorize(password, email).then((res) => {
      if (res.token) {
        handleLogin(email);
        navigate('/', { replace: true });
      }
    })
      .catch(err => console.log(err));
  }

  return (
    <AuthForm
      title="Вход"
      btnName="Войти"
      onSubmit={onSubmitAuthorize}
    />
  )
}

export default Login;