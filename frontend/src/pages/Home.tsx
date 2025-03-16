import { useEffect } from "react";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import useProductStore from "../stores/productStore";
import { categories } from "../utils/catgory";

const Home = () => {
  const{products,loading,getfeaturedProduct} = useProductStore();
  useEffect(() => {
    getfeaturedProduct();
  },[getfeaturedProduct]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in fashionable ways
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategorySection category={category} key={category.name} />
          ))}
        </div>

        {!loading && products?.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default Home;
