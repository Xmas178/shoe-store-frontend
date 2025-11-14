import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Admin.css';

function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');

    const [newProduct, setNewProduct] = useState({
        name: '',
        brand: '',
        description: '',
        price: '',
        category: '',
        image_url: ''
    });

    const [newVariant, setNewVariant] = useState({
        product_id: '',
        size: '',
        color: '',
        stock_quantity: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const fetchAllVariants = async () => {
        try {
            // Hae ensin tuotteet jos ei ole vielä haettu
            let productsList = products;
            if (products.length === 0) {
                const productsResponse = await api.get('/products');
                productsList = productsResponse.data;
                setProducts(productsList);
            }

            const allVariants = [];
            for (const product of productsList) {
                const response = await api.get(`/variants/product/${product.id}`);
                allVariants.push(...response.data.map(v => ({
                    ...v,
                    product_name: product.name
                })));
            }
            setVariants(allVariants);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                name: newProduct.name,
                brand: newProduct.brand,
                description: newProduct.description,
                base_price: parseFloat(newProduct.price),  // price → base_price
                image_url: newProduct.image_url || null,
                category: newProduct.category  // Lisää tämä jos backend tarvitsee
            });
            alert('Tuote lisätty onnistuneesti!');
            setNewProduct({
                name: '',
                brand: '',
                description: '',
                price: '',
                category: '',
                image_url: ''
            });
            fetchProducts();
            setActiveTab('products');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Tuotteen lisäys epäonnistui');
        }
    };

    const handleAddVariant = async (e) => {
        e.preventDefault();
        try {
            await api.post('/variants', {
                product_id: parseInt(newVariant.product_id),
                size: newVariant.size,
                color: newVariant.color,
                price: 0,  // TAI parseFloat(newVariant.price) jos lisäät price-kentän
                stock: parseInt(newVariant.stock_quantity)  // stock_quantity → stock
            });
            alert('Variantti lisätty onnistuneesti!');
            setNewVariant({
                product_id: '',
                size: '',
                color: '',
                stock_quantity: ''
            });
            fetchAllVariants();
        } catch (error) {
            console.error('Error adding variant:', error);
            alert('Variantin lisäys epäonnistui');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Haluatko varmasti poistaa tämän tuotteen?')) return;

        try {
            console.log('Deleting product:', id); // DEBUG
            const response = await api.delete(`/products/${id}`);
            console.log('Delete response:', response); // DEBUG
            alert('Tuote poistettu');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            console.error('Error details:', error.response?.data); // LISÄÄ TÄMÄ
            alert(`Tuotteen poisto epäonnistui: ${error.response?.data?.detail || error.message}`);
        }
    };

    const deleteVariant = async (id) => {
        if (!window.confirm('Haluatko varmasti poistaa tämän variantin?')) return;

        try {
            console.log('Deleting variant:', id); // DEBUG
            await api.delete(`/variants/${id}`);
            alert('Variantti poistettu');
            fetchAllVariants();
        } catch (error) {
            console.error('Error deleting variant:', error);
            console.error('Error details:', error.response?.data); // LISÄÄ TÄMÄ
            alert(`Variantin poisto epäonnistui: ${error.response?.data?.detail || error.message}`);
        }
    };

    if (loading) {
        return <div className="loading">Ladataan...</div>;
    }

    return (
        <div className="admin">
            <h1>Ylläpitopaneeli</h1>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    Tuotteet
                </button>
                <button
                    className={activeTab === 'addProduct' ? 'active' : ''}
                    onClick={() => setActiveTab('addProduct')}
                >
                    Lisää tuote
                </button>
                <button
                    className={activeTab === 'variants' ? 'active' : ''}
                    onClick={() => setActiveTab('variants')}
                >
                    Variantit
                </button>
                <button
                    className={activeTab === 'inventory' ? 'active' : ''}
                    onClick={async () => {
                        setActiveTab('inventory');
                        setLoading(true);

                        // Hae variantit suoraan täällä
                        try {
                            const allVariants = [];
                            const productsList = products.length > 0 ? products : (await api.get('/products')).data;

                            for (const product of productsList) {
                                const response = await api.get(`/variants/product/${product.id}`);
                                const variantsWithProduct = response.data.map(v => ({
                                    ...v,
                                    product_name: product.name
                                }));
                                allVariants.push(...variantsWithProduct);
                            }

                            setVariants(allVariants);
                            console.log('Variants loaded:', allVariants); // DEBUG
                        } catch (error) {
                            console.error('Error:', error);
                        }

                        setLoading(false);
                    }}
                >
                    Varastotilanne
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'products' && (
                    <div className="products-list">
                        <h2>Kaikki tuotteet</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nimi</th>
                                    <th>Brändi</th>
                                    <th>Hinta</th>
                                    <th>Kategoria</th>
                                    <th>Toiminnot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.brand}</td>
                                        <td>{(product.base_price || 0).toFixed(2)} €</td>
                                        <td>{product.category}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                Poista
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'addProduct' && (
                    <div className="add-product">
                        <h2>Lisää uusi tuote</h2>
                        <form onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Nimi</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Brändi</label>
                                <input
                                    type="text"
                                    value={newProduct.brand}
                                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Kuvaus</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    required
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label>Hinta (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Kategoria</label>
                                <input
                                    type="text"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Kuvan URL (valinnainen)</label>
                                <input
                                    type="url"
                                    value={newProduct.image_url}
                                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="submit-btn">Lisää tuote</button>
                        </form>
                    </div>
                )}

                {activeTab === 'variants' && (
                    <div className="add-variant">
                        <h2>Lisää uusi variantti</h2>
                        <form onSubmit={handleAddVariant}>
                            <div className="form-group">
                                <label>Tuote</label>
                                <select
                                    value={newVariant.product_id}
                                    onChange={(e) => setNewVariant({ ...newVariant, product_id: e.target.value })}
                                    required
                                >
                                    <option value="">Valitse tuote</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.brand})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Koko (EU)</label>
                                <input
                                    type="text"
                                    value={newVariant.size}
                                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                                    required
                                    placeholder="esim. 42"
                                />
                            </div>

                            <div className="form-group">
                                <label>Väri</label>
                                <input
                                    type="text"
                                    value={newVariant.color}
                                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Varastomäärä</label>
                                <input
                                    type="number"
                                    value={newVariant.stock_quantity}
                                    onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">Lisää variantti</button>
                        </form>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="inventory">
                        <h2>Varastotilanne</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tuote</th>
                                    <th>Koko</th>
                                    <th>Väri</th>
                                    <th>Varastossa</th>
                                    <th>Toiminnot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map(variant => (
                                    <tr key={variant.id} className={variant.stock
                                        === 0 ? 'out-of-stock' : ''}>
                                        <td>{variant.product_name || 'Ladataan...'}</td>
                                        <td>EU {variant.size}</td>
                                        <td>{variant.color}</td>
                                        <td>
                                            <span className={variant.stock
                                                < 5 ? 'low-stock' : ''}>
                                                {variant.stock
                                                } kpl
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteVariant(variant.id)}
                                            >
                                                Poista
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;