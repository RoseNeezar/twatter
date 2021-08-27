export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
}

export interface IError {
  errors: {
    message: string;
  }[];
}
