import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Cart.css';

function Cart() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        fetchCart();
    }, [user, navigate]);

    if (!user) {
        return (
            <div className="cart">
                <h1>Ostoskori</h1>
                <div className="empty-cart">
                    <p>Kirjaudu sisään nähdäksesi ostoskorisi</p>
                    <button onClick={() => navigate('/login')} className="continue-shopping">
                        Kirjaudu sisään
                    </button>
                </div>
            </div>
        );
    }

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            const items = response.data.items || [];
            setCartItems(items);

            if (items.length > 0) {
                // Hae tuotteet vain jos korissa on jotain
                const productIds = [...new Set(items.map(item => item.variant?.product_id).filter(Boolean))];
                const productPromises = productIds.map(id => api.get(`/products/${id}`));
                const productResponses = await Promise.all(productPromises);

                const productsMap = {};
                productResponses.forEach(res => {
                    productsMap[res.data.id] = res.data;
                });
                setProducts(productsMap);
            }

            setLoading(false);
            setError(''); // Tyhjennä virhe jos lataus onnistui
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Tarkista onko kyse oikeasta virheestä vai tyhjästä korista
            if (error.response?.status === 404 || error.response?.status === 400) {
                // Tyhjä ostoskori tai ei löydy - ei ole virhe
                setCartItems([]);
                setError('');
            } else {
                // Oikea virhe
                setError('Ostoskorin lataus epäonnistui. Yritä myöhemmin uudelleen.');
            }
            setLoading(false);
        }
    };
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            // Lähetä quantity query parametrina, ei bodyna
            await api.put(`/cart/items/${itemId}?quantity=${newQuantity}`);
            fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Määrän päivitys epäonnistui');
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/items/${itemId}`);
            fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Tuotteen poisto epäonnistui');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.variant?.product_id];
            return total + ((product?.base_price || 0) * item.quantity);
        }, 0).toFixed(2);
    };

    const checkout = async () => {
        try {
            const response = await api.post('/orders', {
                shipping_address: 'Osoite tähän'
            });
            alert('Tilaus tehty onnistuneesti!');
            fetchCart();
            navigate('/');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Tilauksen tekeminen epäonnistui');
        }
    };

    if (loading) {
        return <div className="loading">Ladataan ostoskoria...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="cart">
            <h1>Ostoskori</h1>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Ostoskorisi on tyhjä</p>
                    <button onClick={() => navigate('/products')} className="continue-shopping">
                        Jatka ostoksia
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            const product = products[item.variant?.product_id];

                            return (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        {product?.image_url ? (
                                            <img src={product.image_url} alt={product.name} />
                                        ) : (
                                            <div className="no-image">👟</div>
                                        )}
                                    </div>

                                    <div className="cart-item-info">
                                        <h3>{product?.name || 'Tuote'}</h3>
                                        <p className="cart-item-brand">{product?.brand || ''}</p>
                                        <p className="cart-item-size">Koko: EU {item.variant?.size || ''}</p>
                                        <p className="cart-item-color">Väri: {item.variant?.color || ''}</p>
                                    </div>

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

                                    <div className="cart-item-price">
                                        {((product?.base_price || 0) * item.quantity).toFixed(2)} €
                                    </div>

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

                    <div className="cart-summary">
                        <div className="cart-total">
                            <h2>Yhteensä:</h2>
                            <h2>{calculateTotal()} €</h2>
                        </div>
                        <button className="checkout-button" onClick={checkout}>
                            Siirry kassalle
                        </button>
                        <button
                            className="continue-shopping-link"
                            onClick={() => navigate('/products')}
                        >
                            Jatka ostoksia
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;