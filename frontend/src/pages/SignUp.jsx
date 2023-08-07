import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { userCreationSchema } from "../schemas/userSchemas";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [about, setAbout] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleChangeFirstname = (e) => {
    setFirstname(e.target.value);
  };

  const handleChangeLastname = (e) => {
    setLastname(e.target.value);
  };

  const handleChangePseudo = (e) => {
    setPseudo(e.target.value);
  };

  const handleChangeAbout = (e) => {
    setAbout(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setMail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      // Validate the data using your Yup schema
      userCreationSchema.validateSync(
        {
          firstname,
          lastname,
          mail,
          password,
          about,
          pseudo,
        },
        { abortEarly: false }
      );

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          mail,
          password,
          about,
          pseudo,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Votre compte a été créé avec succès !");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch(() => {
          toast.error("Error à la création du compte, veuillez rééssayer !!!");
        });
    } catch (error) {
      const validationErrors = error.inner.reduce((acc, validationError) => {
        return {
          ...acc,
          [validationError.path]: validationError.message,
        };
      }, {});

      console.error("Validation errors:", validationErrors);

      if (validationErrors.firstname) {
        toast.error(validationErrors.firstname);
      }
      if (validationErrors.lastname) {
        toast.error(validationErrors.lastname);
      }
      if (validationErrors.mail) {
        toast.error(validationErrors.mail);
      }
      if (validationErrors.password) {
        toast.error(validationErrors.password);
      }
    }
  };

  return (
    <section className="pt-28 sm:pt-32 sm:flex px-4 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-[#282e4d] shadow-[#1a1c27] shadow-xl rounded-xl text-white px-4 sm:px-20 py-10 xl:w-6/12 m-auto mb-4 flex flex-col"
      >
        <div className="flexflex-col w-auto">
          <div className="sm:flex gap-3 mb-2 sm:mb-5">
            <label htmlFor="pseudo" className=" flex items-center">
              Pseudo :{" "}
            </label>
            <input
              className="shadow-[#0e0f14] shadow-xl flex w-full sm:w-2/6 sm:h-8 px-2 text-black bg-[#d9dae2] rounded-md"
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={handleChangePseudo}
            />
          </div>

          <div className="sm:flex gap-3 mb-3 flex-wrap">
            <label htmlFor="firstname" className="flex items-center ">
              * Prénom :
            </label>
            <input
              className="w-full shadow-[#0e0f14] shadow-xl sm:h-8 px-2 text-black flex-1 bg-[#d9dae2] rounded-md mb-2 sm:mb-0"
              type="text"
              id="firstname"
              value={firstname}
              onChange={handleChangeFirstname}
            />
            <label htmlFor="lastname" className=" flex items-center">
              * Nom :{" "}
            </label>
            <input
              className="shadow-[#0e0f14] shadow-xl flex w-full px-2 sm:h-8 text-black flex-1 bg-[#d9dae2] rounded-md"
              type="text"
              id="lastname"
              value={lastname}
              onChange={handleChangeLastname}
            />
          </div>
          <div className="sm:flex sm:flex-col">
            <label htmlFor="about" className="mb-2">
              A propos de vous :
            </label>
            <textarea
              rows={5}
              cols={40}
              className=" shadow-[#0e0f14] shadow-xl text-black flex-1 mb-5 px-4 py-3 bg-[#d9dae2] rounded-md w-full"
              type="text"
              id="about"
              value={about}
              onChange={handleChangeAbout}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 ">
            <label htmlFor="mail" className=" flex items-center">
              * Email :{" "}
            </label>
            <input
              className="shadow-[#0e0f14] shadow-xl w-full sm:h-8 px-2 text-black flex-1 bg-[#d9dae2] rounded-md"
              type="mail"
              id="mail"
              value={mail}
              onChange={handleChangeEmail}
            />
            <label htmlFor="password" className=" flex items-center">
              * Mot de passe :{" "}
            </label>
            <input
              className="w-full shadow-[#0e0f14] shadow-xl sm:h-8 px-2 text-black flex-1 bg-[#d9dae2] rounded-md "
              type="password"
              id="password"
              value={password}
              onChange={handleChangePassword}
            />
          </div>
        </div>
        <div className="flex justify-center ">
          <button
            type="submit"
            className="mx-4 mt-8 bg-[#52597a] rounded-full shadow-[#0b0b10] shadow-xl px-6 py-2 hover:text-white hover:bg-[#3c4369]"
          >
            <p className="text-sm">Finaliser votre inscription</p>
          </button>
          <ToastContainer
            position="bottom-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
        <p className="italic text-xs">* Mentions obligatoire</p>
      </form>
    </section>
  );
}
