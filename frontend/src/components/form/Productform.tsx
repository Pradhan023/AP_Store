import React from "react";
import { FieldType, IFile } from "../../types/productForm.types";

interface IForm {
  InputField: (data: FieldType) => React.ReactElement;
  SelectField: (data: FieldType) => React.ReactElement;
  Textarea: (data: FieldType) => React.ReactElement;
  File: (data: IFile) => React.ReactElement;
}

const Productform: IForm = {
  InputField: ({ label, name, type, placeholder, register, errors }) => {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
        <input
          spellCheck={false}
          type={type}
          id={name}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
            py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
             focus:border-emerald-500"
          {...register(name!, {
            required: `${
              name![0].toUpperCase() + name!.substring(1)
            } is required`,
          })}
          placeholder={placeholder}
        />
        {errors && (
          <span className="text-sm text-red-600">{errors.message}</span>
        )}
      </div>
    );
  },
  SelectField: ({ label, name, register, errors, categories }) => {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
        <select
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
        shadow-sm py-2 px-3 text-white focus:outline-none 
        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          id={name}
          {...register(name!, {
            required: "Please select a category",
          })}
        >
          <option value="">Select Category</option>
          {categories?.map((catgory) => (
            <option key={catgory} value={catgory}>
              {catgory}
            </option>
          ))}
        </select>
        {errors && (
          <span className="text-sm text-red-600">{errors.message}</span>
        )}
      </div>
    );
  },
  Textarea: ({ label, name, register, errors, rows }) => {
    return (
      <div>
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-300"
        >
          Description
        </label>
        <textarea
          spellCheck={false}
          id={name}
          {...register(name!, {
            required: `${
              name![0].toUpperCase() + name!.substring(1)
            } is required`,
          })}
          rows={rows}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
        />
        {errors && (
          <span className="text-sm text-red-600">{errors.message}</span>
        )}
      </div>
    );
  },
  File: ({ preview, handleImage, removeImage, open, setOpen, register, errors ,X , Upload , motion }) => {
    return (
      <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*" //sr-only is used to hide the file input in the UI in order to avoid accessibility issues in tailwind
            {...register("image", { required: "Image is required" })}
            onChange={handleImage}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {preview && (
            <div className="ml-2 cursor-pointer">
              <div className="flex space-x-1 items-center">
                <p
                  onClick={() => setOpen(!open)}
                  className="text-sm text-gray-300 hover:text-gray-400"
                >
                  Preview
                </p>
                <X onClick={removeImage} size={18} />
              </div>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  onClick={() => setOpen(!open)}
                  className="fixed  inset-0 bg-black bg-opacity-85 flex items-center justify-center "
                >
                  <img
                    src={preview || " "}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </motion.div>
              )}
            </div>
          )}
          {preview && (
            <span className="ml-3 text-sm text-gray-400">
              Image uploaded successfully!{" "}
            </span>
          )}
          {errors && !preview && (
            <span className="text-sm text-red-600 ml-2">
              {errors?.message}
            </span>
          )}
        </div>
    )
  }
};

export default Productform;
