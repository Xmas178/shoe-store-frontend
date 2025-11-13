import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchVariants();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Tuotteen lataus epäonnistui');
            setLoading(false);
        }
    };

    const fetchVariants = async () => {
        try {
            const response = await api.get(`/variants/product/${id}`);
            setVariants(response.data);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const addToCart = async () => {
        if (!user) {
            alert('Kirjaudu sisään lisätäksesi tuotteita ostoskoriin');
            navigate('/login');
            return;
        }

        if (!selectedVariant) {
            alert('Valitse koko');
            return;
        }

        setAddingToCart(true);
        try {
            await api.post('/cart/items', {
                variant_id: selectedVariant.id,
                quantity: 1
            });
            alert('Tuote lisätty ostoskoriin!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Tuotteen lisäys epäonnistui');
        }
        setAddingToCart(false);
    };

    if (loading) {
        return <div className="loading">Ladataan tuotetta...</div>;
    }

    if (error || !product) {
        return <div className="error">{error || 'Tuotetta ei löytynyt'}</div>;
    }

    return (
        <div className="product-detail">
            <div className="product-detail-container">
                <div className="product-detail-image">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                    ) : (
                        <div className="no-image">👟</div>
                    )}
                </div>

                <div className="product-detail-info">
                    <p className="product-brand">{product.brand}</p>
                    <h1>{product.name}</h1>
                    <p className="product-price">{product.price} €</p>
                    <p className="product-description">{product.description}</p>

                    <div className="variants-section">
                        <h3>Valitse koko:</h3>
                        <div className="variants-grid">
                            {variants.length === 0 ? (
                                <p>Ei kokoja saatavilla</p>
                            ) : (
                                variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        className={`variant-button ${selectedVariant?.id === variant.id ? 'selected' : ''
                                            } ${variant.stock_quantity === 0 ? 'out-of-stock' : ''}`}
                                        onClick={() => setSelectedVariant(variant)}
                                        disabled={variant.stock_quantity === 0}
                                    >
                                        EU {variant.size}
                                        {variant.stock_quantity === 0 && ' (Loppu)'}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <button
                        className="add-to-cart-button"
                        onClick={addToCart}
                        disabled={addingToCart || !selectedVariant}
                    >
                        {addingToCart ? 'Lisätään...' : 'Lisää ostoskoriin'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;