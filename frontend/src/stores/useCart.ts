import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

interface CartTypes{
    cartItem:any[];
    loading:boolean;
    coupon:null | any;
    total:number;
    subtotal:number;
    isCouponApplied:boolean;
    getCartProduct:()=>Promise<void>;
    addToCart:(product:any)=>Promise<any>;
    removeCart:(id:string)=>Promise<void>;
    updateQuantity:(id:string,quantity:number)=>Promise<void>;
    calculateTotals:()=>void;
    getMyCoupon:()=>Promise<void>;
    applyCoupon:(code:string)=>Promise<void>;
    removeCoupon:()=>void;
    clearCart:()=>Promise<void>
}

const useCart = create<CartTypes>((set,get)=>({
    cartItem:[],
    loading:false,
    coupon:null,
    total:0,
    subtotal:0,
    isCouponApplied:false,


    getCartProduct:async()=>{
        try {
            const res = await axiosInstance.get("/cart");
            set({loading:false,cartItem:res.data.data});
            get().calculateTotals()
        } catch (error) {
            set({loading:false,cartItem:[]});
        }
    },
    addToCart : async(product)=>{
        const{_id} = product;
        set({loading:true});
        try {
            await axiosInstance.post(`/cart`,{productId:_id});
            set((prevState) => {
				const existingItem = prevState.cartItem.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cartItem.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cartItem, { ...product, quantity: 1 }];
				return { cartItem: newCart };
			});
            toast.success("Product added to cart",{ id: "added" });
            get().calculateTotals()
        } catch (error) {
            set({loading:false});
            toast.error("Failed to add to cart",{ id: "failed" });
        }
    },
    removeCart:async(id)=>{
        set({loading:true});
        try {
            await axiosInstance.delete(`/cart`,{data:{productId:id}});
            set((prevstate=>({
                cartItem: prevstate.cartItem.filter(item => item._id !== id),
                loading:false
            })));
            toast.success("Product removed from cart",{ id: "removed" });
            get().calculateTotals();
        } catch (error) {
            set({loading:false});
            toast.error("Failed to remove from cart",{ id: "failed" });
        }
    },
    updateQuantity : async(id,quantity)=>{
        set({loading:true});
        try {
            if(quantity === 0 ){
                get().removeCart(id);
                return;
            }
             await axiosInstance.put(`/cart/${id}`,{ quantity:quantity });
             set((prevState) => ({
                cartItem: prevState.cartItem.map((item) => ( item._id === id ? { ...item, quantity } : item)),
            }));
            toast.success("Product quantity updated",{ id: "updated" });
            get().calculateTotals();
        } catch (error) {
            set({loading:false});
            toast.error("Failed to update quantity",{ id: "failed" });
        }
    },

    // so whenever we add or remove or update the quantity we have to calculate the subtotal and total
    // we will call this fun after the operation of add etc , get().calculateTotals()
    calculateTotals : ()=>{
        const{cartItem,coupon} = get(); // so basically this get function is used to get the state or other things of the useCart store
        const subtotal = cartItem.reduce((accu,item)=> accu + item.price * item.quantity , 0);
        let total = subtotal;

        if(coupon){
            const discount = subtotal * (coupon.discountPercentages / 100);
            total = subtotal - discount;
        }
        set({ total,subtotal})
    },
    getMyCoupon : async()=>{
        try {
            const res = await axiosInstance.get("/coupons");
            set({coupon:res.data.data[0]});
            
        } catch (error) {
            set({coupon:null});
            
        }
    },
    applyCoupon: async(code)=>{
        try {
            const res = await axiosInstance.post("/coupons/validate",{code:code});
            set({coupon:res.data,isCouponApplied:true});
            get().calculateTotals()
            toast.success("Coupon is applied",{id:"coupon"});
        } catch (error:any) {
            set({coupon:null})
            toast.error(error.response.data.message,{id:"error"})
        }
    },
    removeCoupon : ()=>{
        set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
    },
    clearCart: async () => {
		set({ cartItem: [], coupon: null, total: 0, subtotal: 0 });
	},
    
}))

export default useCart