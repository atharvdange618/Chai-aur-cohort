import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://api.freeapi.app/api/v1/public/randomproducts";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

interface ApiResponse {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: Product[];
  };
  message: string;
  success: boolean;
}

export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ApiResponse = await res.json();
        if (data.success && data.data?.data) {
          setProducts(data.data.data);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all"
        >
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#2d2d2d]">Products</h1>
        <p className="text-[#6b6b6b] mt-1">Browse our collection</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-[#6b6b6b]">Loading products...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[6px_6px_0_#2d2d2d] transition-all duration-200"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="inline-block text-xs font-medium text-[#6b6b6b] bg-[#e8d5c4] px-2 py-0.5 rounded mb-2">
                  {product.category}
                </span>
                <h3 className="text-[#2d2d2d] font-medium text-sm line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <p className="text-[#6b6b6b] text-xs line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold text-[#2d2d2d]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="ml-2 text-xs text-green-600">
                        -{product.discountPercentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-[#6b6b6b]">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#2d2d2d]/20">
                  <span
                    className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                  <span className="text-xs text-[#6b6b6b] ml-2">
                    • {product.brand}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
