import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Admin.css';

function Admin({ t }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');

    // Form state for new product
    const [newProduct, setNewProduct] = useState({
        name: '',
        brand: '',
        description: '',
        price: '',
        category: '',
        image_url: ''
    });

    // Form state for new variant
    const [newVariant, setNewVariant] = useState({
        product_id: '',
        size: '',
        color: '',
        stock_quantity: ''
    });

    // Check authentication and fetch products on mount
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    // Fetch all products from API
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

    // Fetch all variants with associated product names
    const fetchAllVariants = async () => {
        try {
            // Fetch products first if not already loaded
            let productsList = products;
            if (products.length === 0) {
                const productsResponse = await api.get('/products');
                productsList = productsResponse.data;
                setProducts(productsList);
            }

            // Fetch variants for each product
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

    // Handle new product form submission
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                name: newProduct.name,
                brand: newProduct.brand,
                description: newProduct.description,
                base_price: parseFloat(newProduct.price),
                image_url: newProduct.image_url || null,
                category: newProduct.category
            });
            alert(t.productAddedSuccess);
            // Reset form
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
            alert(t.productAddFailed);
        }
    };

    // Handle new variant form submission
    const handleAddVariant = async (e) => {
        e.preventDefault();
        try {
            await api.post('/variants', {
                product_id: parseInt(newVariant.product_id),
                size: newVariant.size,
                color: newVariant.color,
                price: 0,
                stock: parseInt(newVariant.stock_quantity)
            });
            alert(t.variantAddedSuccess);
            // Reset form
            setNewVariant({
                product_id: '',
                size: '',
                color: '',
                stock_quantity: ''
            });
            fetchAllVariants();
        } catch (error) {
            console.error('Error adding variant:', error);
            alert(t.variantAddFailed);
        }
    };

    // Delete product with confirmation
    const deleteProduct = async (id) => {
        if (!window.confirm(t.confirmDeleteProduct)) return;

        try {
            console.log('Deleting product:', id);
            const response = await api.delete(`/products/${id}`);
            console.log('Delete response:', response);
            alert(t.productDeleted);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            console.error('Error details:', error.response?.data);
            alert(`${t.productDeleteFailed}: ${error.response?.data?.detail || error.message}`);
        }
    };

    // Delete variant with confirmation
    const deleteVariant = async (id) => {
        if (!window.confirm(t.confirmDeleteVariant)) return;

        try {
            console.log('Deleting variant:', id);
            await api.delete(`/variants/${id}`);
            alert(t.variantDeleted);
            fetchAllVariants();
        } catch (error) {
            console.error('Error deleting variant:', error);
            console.error('Error details:', error.response?.data);
            alert(`${t.variantDeleteFailed}: ${error.response?.data?.detail || error.message}`);
        }
    };

    // Show loading state
    if (loading) {
        return <div className="loading">{t.loading}</div>;
    }

    return (
        <div className="admin">
            {/* Admin panel heading */}
            <h1>{t.adminPanel}</h1>

            {/* Tab navigation */}
            <div className="admin-tabs">
                <button
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    {t.products}
                </button>
                <button
                    className={activeTab === 'addProduct' ? 'active' : ''}
                    onClick={() => setActiveTab('addProduct')}
                >
                    {t.addProduct}
                </button>
                <button
                    className={activeTab === 'variants' ? 'active' : ''}
                    onClick={() => setActiveTab('variants')}
                >
                    {t.variants}
                </button>
                <button
                    className={activeTab === 'inventory' ? 'active' : ''}
                    onClick={async () => {
                        setActiveTab('inventory');
                        setLoading(true);

                        // Fetch variants directly when tab is clicked
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
                            console.log('Variants loaded:', allVariants);
                        } catch (error) {
                            console.error('Error:', error);
                        }

                        setLoading(false);
                    }}
                >
                    {t.inventory}
                </button>
            </div>

            <div className="admin-content">
                {/* Products list tab */}
                {activeTab === 'products' && (
                    <div className="products-list">
                        <h2>{t.allProducts}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{t.productName}</th>
                                    <th>{t.brand}</th>
                                    <th>{t.price}</th>
                                    <th>{t.category}</th>
                                    <th>{t.actions}</th>
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
                                                {t.delete}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add product form tab */}
                {activeTab === 'addProduct' && (
                    <div className="add-product">
                        <h2>{t.addNewProduct}</h2>
                        <form onSubmit={handleAddProduct}>
                            {/* Product name field */}
                            <div className="form-group">
                                <label>{t.productName}</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Brand field */}
                            <div className="form-group">
                                <label>{t.brand}</label>
                                <input
                                    type="text"
                                    value={newProduct.brand}
                                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Description field */}
                            <div className="form-group">
                                <label>{t.productDescription}</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    required
                                    rows="4"
                                />
                            </div>

                            {/* Price field */}
                            <div className="form-group">
                                <label>{t.productPrice} (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Category field */}
                            <div className="form-group">
                                <label>{t.productCategory}</label>
                                <input
                                    type="text"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Image URL field (optional) */}
                            <div className="form-group">
                                <label>{t.productImage} ({t.optional})</label>
                                <input
                                    type="url"
                                    value={newProduct.image_url}
                                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="submit-btn">{t.addProduct}</button>
                        </form>
                    </div>
                )}

                {/* Add variant form tab */}
                {activeTab === 'variants' && (
                    <div className="add-variant">
                        <h2>{t.addNewVariant}</h2>
                        <form onSubmit={handleAddVariant}>
                            {/* Product selection dropdown */}
                            <div className="form-group">
                                <label>{t.product}</label>
                                <select
                                    value={newVariant.product_id}
                                    onChange={(e) => setNewVariant({ ...newVariant, product_id: e.target.value })}
                                    required
                                >
                                    <option value="">{t.selectProduct}</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.brand})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Size field */}
                            <div className="form-group">
                                <label>{t.sizeEU}</label>
                                <input
                                    type="text"
                                    value={newVariant.size}
                                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                                    required
                                    placeholder="esim. 42"
                                />
                            </div>

                            {/* Color field */}
                            <div className="form-group">
                                <label>{t.color}</label>
                                <input
                                    type="text"
                                    value={newVariant.color}
                                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Stock quantity field */}
                            <div className="form-group">
                                <label>{t.stockQuantity}</label>
                                <input
                                    type="number"
                                    value={newVariant.stock_quantity}
                                    onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">{t.addProduct}</button>
                        </form>
                    </div>
                )}

                {/* Inventory status tab */}
                {activeTab === 'inventory' && (
                    <div className="inventory">
                        <h2>{t.inventory}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.product}</th>
                                    <th>{t.size}</th>
                                    <th>{t.color}</th>
                                    <th>{t.stock}</th>
                                    <th>{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map(variant => (
                                    <tr key={variant.id} className={variant.stock === 0 ? 'out-of-stock' : ''}>
                                        <td>{variant.product_name || t.loading}</td>
                                        <td>EU {variant.size}</td>
                                        <td>{variant.color}</td>
                                        <td>
                                            <span className={variant.stock < 5 ? 'low-stock' : ''}>
                                                {variant.stock} {t.inStock}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteVariant(variant.id)}
                                            >
                                                {t.delete}
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