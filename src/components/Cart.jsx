import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Cart.css';

function Cart({ t }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch cart when component mounts or user changes
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        fetchCart();
    }, [user, navigate]);

    // Show login prompt if user is not authenticated
    if (!user) {
        return (
            <div className="cart">
                <h1>{t.shoppingCart}</h1>
                <div className="empty-cart">
                    <p>{t.loginToViewCart}</p>
                    <button onClick={() => navigate('/login')} className="continue-shopping">
                        {t.login}
                    </button>
                </div>
            </div>
        );
    }

    // Fetch cart items and associated product details
    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            const items = response.data.items || [];
            setCartItems(items);

            // Fetch product details only if cart has items
            if (items.length > 0) {
                const productIds = [...new Set(items.map(item => item.variant?.product_id).filter(Boolean))];
                const productPromises = productIds.map(id => api.get(`/products/${id}`));
                const productResponses = await Promise.all(productPromises);

                // Create products map for quick lookup
                const productsMap = {};
                productResponses.forEach(res => {
                    productsMap[res.data.id] = res.data;
                });
                setProducts(productsMap);
            }

            setLoading(false);
            setError('');
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Differentiate between empty cart and actual errors
            if (error.response?.status === 404 || error.response?.status === 400) {
                setCartItems([]);
                setError('');
            } else {
                setError(t.cartLoadFailed);
            }
            setLoading(false);
        }
    };

    // Update item quantity in cart
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await api.put(`/cart/items/${itemId}?quantity=${newQuantity}`);
            fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert(t.updateFailed);
        }
    };

    // Remove item from cart
    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/items/${itemId}`);
            fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
            alert(t.removeFailed);
        }
    };

    // Calculate total price of all items in cart
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.variant?.product_id];
            return total + ((product?.base_price || 0) * item.quantity);
        }, 0).toFixed(2);
    };

    // Process checkout and create order
    const checkout = async () => {
        try {
            const response = await api.post('/orders', {
                shipping_address: 'Osoite tähän'
            });
            alert(t.orderSuccess);
            fetchCart();
            navigate('/');
        } catch (error) {
            console.error('Error creating order:', error);
            alert(t.orderFailed);
        }
    };

    // Show loading state
    if (loading) {
        return <div className="loading">{t.loadingCart}</div>;
    }

    // Show error state
    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="cart">
            <h1>{t.shoppingCart}</h1>

            {cartItems.length === 0 ? (
                // Show empty cart message
                <div className="empty-cart">
                    <p>{t.cartEmpty}</p>
                    <button onClick={() => navigate('/products')} className="continue-shopping">
                        {t.continueShopping}
                    </button>
                </div>
            ) : (
                <>
                    {/* Display cart items */}
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            const product = products[item.variant?.product_id];

                            return (
                                <div key={item.id} className="cart-item">
                                    {/* Product image */}
                                    <div className="cart-item-image">
                                        {product?.image_url ? (
                                            <img src={product.image_url} alt={product.name} />
                                        ) : (
                                            <div className="no-image">👟</div>
                                        )}
                                    </div>

                                    {/* Product details */}
                                    <div className="cart-item-info">
                                        <h3>{product?.name || t.product}</h3>
                                        <p className="cart-item-brand">{product?.brand || ''}</p>
                                        <p className="cart-item-size">{t.size}: EU {item.variant?.size || ''}</p>
                                        <p className="cart-item-color">{t.color}: {item.variant?.color || ''}</p>
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="cart-item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            +
                                        </button>
                                    </div>

                                    {/* Item total price */}
                                    <div className="cart-item-price">
                                        {((product?.base_price || 0) * item.quantity).toFixed(2)} €
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        className="remove-button"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cart summary and checkout */}
                    <div className="cart-summary">
                        <div className="cart-total">
                            <h2>{t.total}:</h2>
                            <h2>{calculateTotal()} €</h2>
                        </div>
                        <button className="checkout-button" onClick={checkout}>
                            {t.checkout}
                        </button>
                        <button
                            className="continue-shopping-link"
                            onClick={() => navigate('/products')}
                        >
                            {t.continueShopping}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;