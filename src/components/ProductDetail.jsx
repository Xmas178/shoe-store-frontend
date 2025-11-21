import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProductDetail.css';

function ProductDetail({ t }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    // Fetch product and variants when component mounts or ID changes
    useEffect(() => {
        fetchProduct();
        fetchVariants();
    }, [id]);

    // Fetch single product details from API
    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError(t.error);
            setLoading(false);
        }
    };

    // Fetch available size variants for this product
    const fetchVariants = async () => {
        try {
            const response = await api.get(`/variants/product/${id}`);
            setVariants(response.data);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    // Add selected variant to shopping cart
    const addToCart = async () => {
        // Check if user is authenticated
        if (!user) {
            alert(t.loginToAddCart);
            navigate('/login');
            return;
        }

        // Validate that size is selected
        if (!selectedVariant) {
            alert(t.selectSizeFirst);
            return;
        }

        setAddingToCart(true);
        try {
            // Add item to cart via API
            await api.post('/cart/items', {
                variant_id: selectedVariant.id,
                quantity: 1
            });
            alert(t.addedToCart);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert(t.addToCartFailed);
        }
        setAddingToCart(false);
    };

    // Show loading state while fetching product
    if (loading) {
        return <div className="loading">{t.loadingProduct}</div>;
    }

    // Show error message if product fetch failed or product not found
    if (error || !product) {
        return <div className="error">{error || t.productNotFound}</div>;
    }

    return (
        <div className="product-detail">
            <div className="product-detail-container">
                {/* Product image section */}
                <div className="product-detail-image">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                    ) : (
                        <div className="no-image">👟</div>
                    )}
                </div>

                {/* Product information and purchase section */}
                <div className="product-detail-info">
                    <p className="product-brand">{product.brand}</p>
                    <h1>{product.name}</h1>
                    <p className="product-price">{(product.base_price || 0).toFixed(2)} €</p>

                    {/* Size selection section */}
                    <div className="variants-section">
                        <h3>{t.selectSize}</h3>
                        <div className="variants-grid">
                            {variants.length === 0 ? (
                                <p>{t.noSizesAvailable}</p>
                            ) : (
                                // Render size buttons for each variant
                                variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        className={`variant-button ${selectedVariant?.id === variant.id ? 'selected' : ''
                                            } ${variant.stock_quantity === 0 ? 'out-of-stock' : ''}`}
                                        onClick={() => setSelectedVariant(variant)}
                                        disabled={variant.stock_quantity === 0}
                                    >
                                        EU {variant.size}
                                        {variant.stock_quantity === 0 && ` (${t.outOfStock})`}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add to cart button */}
                    <button
                        className="add-to-cart-button"
                        onClick={addToCart}
                        disabled={addingToCart || !selectedVariant}
                    >
                        {addingToCart ? t.adding : t.addToCart}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;