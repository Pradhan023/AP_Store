import { ChangeEventHandler } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

export interface producttypes {
  _id: string;
  name: string;
  description: string;
  image: {url:string,publicId:string};
  price: number;
  category: string;
  isFeatured: boolean
  quantity:number
}

export interface IProductForm {
    quantity: number;
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

export interface FieldType{
    label?:string;
    name?: valuename;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<IProductForm>;
    errors: FieldError | undefined;
    categories?: string[]
    rows?: number
}

export interface IFile extends FieldType {
  preview: string | null;
  handleImage: ChangeEventHandler<HTMLInputElement>;
  removeImage: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  X: any;
  Upload: any;
  motion: any;
}

type valuename = "name" | "description" | "price" | "category"  ;