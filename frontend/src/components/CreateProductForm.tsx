import React, { ChangeEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Productform from "./form/Productform";
import { SubmitHandler, useForm } from "react-hook-form";
import { IProductForm } from "../types/productForm.types";
import {  Loader, PlusCircle, Upload, X } from "lucide-react";
import useProductStore from "../stores/productStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const CreateProductForm: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { loading, createProduct } = useProductStore();
  let Loading = loading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IProductForm>();

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const Url = URL.createObjectURL(file); // for preview
      setPreview(Url);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("image", "", { shouldValidate: true }); // Clear React Hook Form's value
  };

  const onSubmit: SubmitHandler<IProductForm> = async(data: IProductForm):Promise<void> => {
    const formdata = new FormData();

    formdata.append("name", data.name);
    formdata.append("description", data.description);
    formdata.append("price", data.price.toString());
    formdata.append("category", data.category);

    if (data?.image[0]) {
      formdata.append("image", data.image[0]);
    }
    await createProduct(formdata);
    reset();
    removeImage();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);


  return (
    <motion.div
      className={`bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <Productform.InputField
          name="name"
          label="Product Name"
          type="text"
          placeholder="Enter Product Name"
          register={register}
          errors={errors.name}
        />
        <Productform.Textarea
          name="description"
          label="Product Description"
          register={register}
          errors={errors.description}
          rows={3}
        />
        <Productform.InputField
          name="price"
          label="Product Price"
          type="number"
          placeholder="Enter Product Price"
          register={register}
          errors={errors.price}
        />
        <Productform.SelectField
          label="Category"
          name="category"
          register={register}
          errors={errors.category}
          categories={categories}
        />

        {/* image */}
        <Productform.File 
        preview = {preview} 
        handleImage = {handleImage} 
        removeImage = {removeImage} 
        open = {open} 
        setOpen = {setOpen} 
        register = {register} 
        errors = {errors.image} 
        Upload = {Upload}
        X = {X}
        motion = {motion}
        />

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={Loading}
        >
          {Loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
