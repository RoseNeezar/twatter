import Head from "next/head";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import InputGroup from "../../components/Input/InputGroup";
import { useAppDispatch } from "../../store/hooks/hooks";
import { register } from "../../store/slices/authSlice";

const RegisterPage = () => {
  const [formState, setFormState] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const { email, firstName, lastName, username, password } = formState;
  const dispatch = useAppDispatch();

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("res", { ...formState });
    if (email && firstName && lastName && username && password) {
      try {
        dispatch(register({ ...formState }));
      } catch (error) {}
    } else {
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen mt-12 bg-dark-main">
        <h1 className="mb-10 text-6xl text-white">Register</h1>
        <div className="flex flex-col items-center justify-center h-auto p-10 shadow-lg w-96 mb-44 bg-dark-second rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col w-full ">
            <InputGroup
              className="mb-4"
              type="email"
              value={email}
              setValue={onChangeText}
              placeholder="Email"
            />
            <InputGroup
              className="mb-4"
              type="username"
              value={username}
              setValue={onChangeText}
              placeholder="Username"
            />
            <InputGroup
              className="mb-4"
              type="firstName"
              value={firstName}
              setValue={onChangeText}
              placeholder="First Name"
            />
            <InputGroup
              className="mb-4"
              type="lastName"
              value={lastName}
              setValue={onChangeText}
              placeholder="Last Name"
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={onChangeText}
              placeholder="Password"
            />

            <button className="self-center w-1/2 py-6 mt-4 mb-4 text-lg font-bold text-white uppercase hover:bg-dark-third rounded-2xl bg-dark-main">
              Register
            </button>
          </form>

          <small className="flex flex-row">
            <p className="text-gray-400"> Have an account?</p>
            <NavLink to="/login">
              <p className="ml-1 text-white uppercase hover:text-gray-400">
                Login
              </p>
            </NavLink>
          </small>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
