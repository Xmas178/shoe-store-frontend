import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Tuotteiden lataus epäonnistui');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Ladataan tuotteita...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="product-list">
            <h1>Tuotteet</h1>

            {products.length === 0 ? (
                <p>Ei tuotteita saatavilla</p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <Link
                            to={`/products/${product.id}`}
                            key={product.id}
                            className="product-card"
                        >
                            <div className="product-image">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} />
                                ) : (
                                    <div className="no-image">👟</div>
                                )}
                            </div>

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