import { FieldError, UseFormRegister } from "react-hook-form";

export interface Namefield {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface fieldProps {
  id: string;
  type: string;
  name: valueFieldname;
  placeholder: string;
  register: UseFormRegister<Namefield>;  //This is a type from the react-hook-form library. It represents a function that registers a form field with the form state management system. <Namefield> is a type parameter that specifies the type of data that the form field will hold. In this case, it's Namefield, which is an interface defined earlier in the code.
  errors: FieldError | undefined;
  minlength?: { value: number ; message:string};
  validate?:(value:string)=>string | undefined;
  onChange?: Function;
}

export type valueFieldname = "name" | "email" | "password" | "confirmPassword";
