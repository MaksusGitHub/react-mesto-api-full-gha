import AuthForm from "./AuthForm";
import * as Auth from '../utils/Auth';
import { Link, useNavigate } from "react-router-dom";

const Register = ({ setIsAuthSuccess, handleAuthResultPopupOpen }) => {

  const navigate = useNavigate();
  
  const onSubmitRegister = (password, email) => {
    Auth.register(password, email).then(() => {
      navigate('/signin', { replace: true });
      setIsAuthSuccess(true);
      handleAuthResultPopupOpen(true);
    })
      .catch(err => {
        setIsAuthSuccess(false);
        handleAuthResultPopupOpen(true);
        console.log(err);
        return;
    })
  }

  return (
    <div className="auth__register-container">
      <AuthForm
        title="Регистрация"
        btnName="Зарегистрироваться"
        onSubmit={onSubmitRegister}
      />
      <Link to="/signin" className="auth__redirect-to-signin">Уже зарегистрированы? Войти</Link>
    </div>
  )
}

export default Register;