import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { producttypes } from "../types/productForm.types";


interface IProductStore {
  products: producttypes[];
  loading: boolean;
  recommandedProducts:producttypes[];
  error: string;
  tableHead: string[];
  createProduct: (formdata: FormData) => Promise<void>;
  fetchProducts: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleFeaturedProduct: (id: string) => Promise<void>;
  fetchPrductByCategory: (category: string) => Promise<void>;
  getRecommandedProduct:()=>void;
  getfeaturedProduct:()=>void;
}

const useProductStore = create<IProductStore>((set) => ({
  products: [],
  loading: false,
  recommandedProducts:[],
  error: "",
  tableHead: ["Product", "Price", "Category", "Featured", "Actions"],

  createProduct: async (formdata) => {
    // console.log(formdata.get("image"));
    const products = {
      name: formdata.get("name"),
      description: formdata.get("description"),
      price: parseInt(formdata.get("price") as string),
      image: formdata.get("image"),
      category: formdata.get("category"),
    };
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", products, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        loading: false,
        products: [...state.products, res.data.data],
      }));
      toast.success("Product created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error("Something went wrong");
    }
  },
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products");

      set({ products: res.data.data, loading: false });
    } catch (errors: any) {
      set({ loading: false, error: "Failed to fetch Products" });
      toast.error(errors.response?.data?.error || "Failed to fetch Products");
    }
  },
  deleteProduct: async (id: string) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.delete(`/products/${id}`);
      set((prevstate) => ({
        products: prevstate.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success(res.data?.message || "Product deleted successfully");
    } catch (error: any) {
      set({ loading: false, error: "Failed to deleting product" });
      toast.error(error.response?.data?.error || "Failed to deleting product");
    }
  },
  toggleFeaturedProduct: async (id: string) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(`/products/${id}`);
      set((state) => ({
        products: state.products.map((product) => 
          product._id === id
            ? { ...product, isFeatured: !product.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success(
        `${
          res.data.data.isFeatured
            ? "Added to featured products"
            : "Removed from featured products"
        }`
      );
    } catch (error: any) {
      set({ loading: false, error: "Something went wrong" });
      toast.error(error.response?.data?.error || "Invalid action");
    }
  },
  fetchPrductByCategory:async(category:string)=>{
    set({loading:true});
    try {
        const res = await axiosInstance.get(`/products/category/${category}`);
        set({loading:false,products:res.data.data});
    } catch (error) {
        set({loading:false});
        toast.error("Failed to fetch Products");
    }
  },
  getRecommandedProduct : async()=>{
    set({loading:true})
    try {
        const res =  await axiosInstance.get("/products/recommendation");
        set({loading:false,recommandedProducts:res.data.data})
    } catch (error) {
        set({loading:false})
    }
    },
  getfeaturedProduct : async()=>{
    set({loading:true})
    try {
        const res =  await axiosInstance.get("/products/featuredproducts");
        set({loading:false,products:res.data.data})
    } catch (error) {
        set({loading:false})
    }
    }
}));

export default useProductStore;
