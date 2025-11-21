import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ProductList.css';

function ProductList({ t }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch products from API on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // API call to get all products
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            console.log('Products response:', response.data); // LISÄÄ TÄMÄ
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(t.error || 'Failed to load products');
            setLoading(false);
        }
    };

    // Show loading state while fetching data
    if (loading) {
        return <div className="loading">{t.loading || 'Loading products...'}</div>;
    }

    // Show error message if fetch failed
    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="product-list">
            {/* Page heading with translation */}
            <h1>{t.allProducts}</h1>

            {products.length === 0 ? (
                // Show message when no products available
                <p>{t.noProducts || 'No products available'}</p>
            ) : (
                // Display products in grid layout
                <div className="products-grid">
                    {products.map((product) => (
                        <Link
                            to={`/products/${product.id}`}
                            key={product.id}
                            className="product-card"
                        >
                            {/* Product image or placeholder */}
                            <div className="product-image">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} />
                                ) : (
                                    <div className="no-image">👟</div>
                                )}
                            </div>

                            {/* Product information */}
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="product-brand">{product.brand}</p>
                                <p className="product-price">{(product.base_price || 0).toFixed(2)} €</p>
                                <p className="product-description">{product.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductList;