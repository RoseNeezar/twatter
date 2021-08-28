import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import InputGroup from "../app/components/Input/InputGroup";
import { useAppDispatch, useAppSelector } from "../app/store/hooks/hooks";
import { isLoggedIn, login } from "../app/store/module/auth/auth.slice";

const LoginPage = () => {
  const router = useRouter();
  const checkLogin = useAppSelector(isLoggedIn);

  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formState;

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        dispatch(
          login({
            email,
            password,
          })
        );
      } catch (error) {}
    } else {
    }
  };
  useEffect(() => {
    if (!!checkLogin) {
      router.push("/app");
    }
  }, [checkLogin]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen mt-12 bg-dark-main">
        <h1 className="mb-10 text-6xl text-white">Login</h1>
        <div className="flex flex-col items-center justify-center h-auto p-10 shadow-lg w-96 mb-44 bg-dark-second rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col w-full ">
            <InputGroup
              className="mb-10"
              type="email"
              value={email}
              setValue={onChangeText}
              placeholder="Email"
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={onChangeText}
              placeholder="Password"
            />

            <button className="self-center w-1/2 py-6 mt-4 mb-4 text-lg font-bold text-white uppercase hover:bg-dark-third rounded-2xl bg-dark-main">
              Login
            </button>
          </form>
          <small className="flex flex-row">
            <p className="text-gray-400"> Dont have an account?</p>
            <Link href="/register">
              <a>
                <p className="ml-1 text-white uppercase hover:text-gray-400">
                  Sign Up
                </p>
              </a>
            </Link>
          </small>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
