import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register({ handleRegistration }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(data);
  };

  return (
    <>
      <div className="register">
        <h2 className="register__title">Inscrever-se</h2>
        <form className="register__form" onSubmit={handleSubmit}>
          <input
            name="email"
            className="register__input"
            type="email"
            placeholder="E-mail"
            required
            value={data.email}
            onChange={handleChange}
          />
          <input
            name="password"
            className="register__input"
            type="password"
            placeholder="Senha"
            required
            value={data.password}
            onChange={handleChange}
          />
          <button className="register__button" type="submit">
            Inscrever-se
          </button>
          <Link className="register__login-text" to="/signin">
            Já é um membro? Faça o login aqui!
          </Link>
        </form>
      </div>
    </>
  );
}
