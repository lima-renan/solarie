import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import bannerHero from "../assets/bannerHero.jpg";
import { Logo } from "../components";
import { useAuthContext } from "../contexts";
import { isValidDate, notify } from "../utils/utils";
import { useEffect, useState } from "react";

const Signup = () => {
  const { signupSubmitHandler, signingUp, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName:"",
    gender:"",
    dayBday:"",
    monthBday:"",
    yearBday:"",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Função para limpar os campos de data
const resetDateFields = () => {
  setUserDetails((prevUserDetails) => ({
    ...prevUserDetails,
    dayBday: "",
    monthBday: "",
    yearBday: "",
  }));
};


  useEffect(() => {
    let id;
    if (isAuthenticated) {
      id = setTimeout(() => {
        navigate("/");
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { dayBday, monthBday, yearBday } = userDetails;
    if (!isValidDate(dayBday, monthBday, yearBday)) {
      notify("warn","Data de nascimento inválida.");
      console.log(dayBday,monthBday)
      resetDateFields(); // Limpar os campos de data
      return;
    }
    signupSubmitHandler(userDetails);
  };

  const isDisabled =
    signingUp ||
    !userDetails.firstName ||
    !userDetails.lastName ||
    !userDetails.gender ||
    !userDetails.email ||
    !userDetails.password ||
    !confirmPassword;
  return (
    <main className="grid  grid-rows-1 md:grid-cols-2 w-full  h-screen m-auto ">
      <section className=" hidden md:block max-h-screen  rounded-lg">
        <img src={bannerHero} alt="" className="w-full h-full object-cover" />
      </section>
      <div className="flex items-center justify-center w-full px-5">
        <section className="px-10 py-10 rounded-md shadow-md bg-white/[0.7] flex flex-col gap-6 w-full max-w-lg">
          <Logo />
          <div className="flex flex-col gap-2 ">
            <h1 className="text-4xl font-bold mb-3">Cadastre-se</h1>

            <form
              action=""
              className="flex flex-col gap-4 py-5"
              onSubmit={handleSubmit}
            >
              <label className="flex flex-col">
                <input
                  type="text"
                  required
                  placeholder="Nome"
                  className="border rounded-md p-1.5 shadow-sm"
                  value={userDetails.firstName}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, firstName: e.target.value })
                  }
                />
              </label>
              <label className="flex flex-col">
                <input
                  type="text"
                  required
                  placeholder="Sobrenome"
                  className="border rounded-md p-1.5 shadow-sm"
                  value={userDetails.lastName}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, lastName: e.target.value })
                  }
                />
              </label>
              <div className="flex flex-col">
                <label className="text-gray-700">Gênero</label>
                <select
                  required
                  className="border rounded-md p-1.5 shadow-sm bg-white"
                  value={userDetails.gender}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, gender: e.target.value })
                  }
                >
                  <option value="">Selecione o gênero</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Não declarar">Não declarar</option>
                </select>
              </div> 
              <label className="text-gray-700">Data de Nascimento</label>
              <div className="flex gap-9"> {}
              <div className="flex flex-col">
                <select
                  required
                  className="border rounded-md p-1.5 shadow-sm w-25 bg-white"
                  name="dayBday"
                  value={userDetails.dayBday}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, dayBday: e.target.value })
                  }
                >
                  <option value="">Dia</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((dayBday) => (
                    <option key={dayBday} value={dayBday}>
                      {dayBday}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <select
                  required
                  className="border rounded-md p-1.5 shadow-sm w-25 bg-white"
                  name="monthBday"
                  value={userDetails.monthBday}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, monthBday: e.target.value })
                  }
                >
                  <option value="">Mês</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((monthBday) => (
                    <option key={monthBday} value={monthBday}>
                      {monthBday}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <select
                  required
                  className="border rounded-md p-1.5 shadow-sm w-40 bg-white"
                  name="yearBday"
                  value={userDetails.yearBday}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, yearBday: e.target.value })
                  }
                >
                  <option value="">Ano</option>
                  {Array.from({ length: 124 }, (_, i) => 1900 + i).map((yearBday) => (
                    <option key={yearBday} value={yearBday}>
                      {yearBday}
                    </option>
                  ))}
                </select>
              </div>
            </div>
              <label className="flex flex-col">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className="border rounded-md p-1.5 shadow-sm"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </label>
              <label className="flex flex-col relative">
                <input
                  required
                  placeholder="Password"
                  type={showPassword.password ? "text" : "password"}
                  className="border rounded-md p-1.5 shadow-sm"
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, password: e.target.value })
                  }
                />
                <span
                  className="absolute right-2 top-3 cursor-pointer"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      password: !showPassword.password,
                    })
                  }
                >
                  {showPassword.password ? (
                    <AiFillEye />
                  ) : (
                    <AiFillEyeInvisible />
                  )}
                </span>
              </label>
              <label className="flex flex-col relative">
                <input
                  required
                  placeholder="Confirme a senha"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  className="border rounded-md p-1.5 shadow-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute right-2 top-3 cursor-pointer"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirmPassword: !showPassword.confirmPassword,
                    })
                  }
                >
                  {showPassword.confirmPassword ? (
                    <AiFillEye />
                  ) : (
                    <AiFillEyeInvisible />
                  )}
                </span>
                <p
                  className={`pt-1 ${
                    userDetails.password &&
                    confirmPassword &&
                    userDetails.password !== confirmPassword
                      ? "visible text-red-600"
                      : "invisible"
                  }`}
                >
                  Senhas não correspondem
                </p>
              </label>
              <div className="w-full py-2   flex flex-col gap-4 items-center">
                <button
                  type="submit"
                  className="btn-primary w-2/3 text-lg text-center"
                  disabled={isDisabled}
                >
                  {signingUp? "Autenticando..." : "Criar conta"}
                </button>
                <p className="text-gray-600 text-sm">
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    className="underline text-base"
                  >
                    Entre
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
