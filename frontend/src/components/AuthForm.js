import { useState } from "react";

const AuthForm = (props) => {
  const {
    title,
    btnName,
    onSubmit,
  } = props;

  const [formValue, setFormValue] = useState({ password: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, email } = formValue;
    onSubmit(password, email)
    setFormValue({ password: '', email: '' });
  }

  return (
    <div className="auth">
      <h2 className="auth__title">{title}</h2>
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <fieldset className="auth__fieldset">
          <label className="auth__field">
            <input
              id="email-input"
              name="email"
              className="auth__input auth__input_type_email"
              type="email"
              value={formValue.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </label>
          <label className="auth__field">
            <input
              id="password-input"
              name="password"
              className="auth__input auth__input_type_password"
              type="password"
              value={formValue.password}
              onChange={handleChange}
              placeholder="Пароль"
              required
            />
          </label>
        </fieldset>
        <button className="auth__button" type="submit">{btnName}</button>
      </form>
    </div>
  )
}

export default AuthForm;