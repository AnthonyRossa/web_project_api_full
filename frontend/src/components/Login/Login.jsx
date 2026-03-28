import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ handleLogin }) {
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
    handleLogin(data);
  };

  return (
    <>
      <div className="login">
        <h2 className="login__title">Entrar</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <input
            name="email"
            className="login__input"
            type="email"
            placeholder="E-mail"
            required
            value={data.email}
            onChange={handleChange}
          />
          <input
            name="password"
            className="login__input"
            type="password"
            placeholder="Senha"
            required
            value={data.password}
            onChange={handleChange}
          />
          <button className="login__button" type="submit">
            Entrar
          </button>
          <Link className="login__register-text" to="/signup">
            Ainda não é membro? Inscreva-se aqui!
          </Link>
        </form>
      </div>
    </>
  );
}
