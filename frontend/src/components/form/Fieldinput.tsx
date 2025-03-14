import { FC } from "react";
import { fieldProps } from "../../types/form.types";

const Fieldinput: FC<fieldProps> = ({
  type,
  id,
  placeholder,
  register,
  name,
  minlength,
  errors,
  validate
}) => {
  return (
    <>
      <input
      spellCheck={false}
      className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
       placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
       sm:text-sm  autofill:autofill-bg autofill:autofill-text'
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: `${name == "confirmPassword" ? "Confirm Password" :name[0].toUpperCase() + name.substring(1)} is required`,
          minLength: minlength,
          validate:validate
        })}
      />
      {errors && <span className="text-sm text-red-600">{errors.message}</span>}
    </>
  );
};

export default Fieldinput;
