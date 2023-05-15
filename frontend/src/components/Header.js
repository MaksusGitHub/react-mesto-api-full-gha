import { Link, useNavigate } from 'react-router-dom';
import headerLogo from '../images/header-logo.svg';

function Header({ email }) {
  const navigate = useNavigate();
  const signOut = () => {
    localStorage.removeItem('jwt');
    navigate('/signin', { replace: true });
  }
  return (
    <header className="header root__content">
      <img className="header__logo" src={headerLogo} alt="Логотип" />
      
        {window.location.pathname === '/' ?
          (
            <div className='header__status-bar'>
              <p className='header__email'>{email}</p>
              <p className='header__status header__status_exit' onClick={signOut}>Выйти</p>
            </div>
        ) :
        <Link to={window.location.pathname === '/signup' ? '/signin' : '/signup'} className='header__status'>
          {window.location.pathname === '/signup' ? 'Войти' : 'Регистрация'}
        </Link>
        }
    </header>
  )
}

export default Header;