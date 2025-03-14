import { useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./Spinner";
import useProductStore from "../stores/productStore";

const PeopleAlsoBought = () => {
    const{recommandedProducts,getRecommandedProduct,loading} = useProductStore()

	useEffect(() => {
        getRecommandedProduct()
	}, [getRecommandedProduct]);
    

	if (loading) return <LoadingSpinner />;

	return (
		<div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-col-4'>
				{recommandedProducts.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};
export default PeopleAlsoBought;