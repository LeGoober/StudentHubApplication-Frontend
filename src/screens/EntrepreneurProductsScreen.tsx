/**
 * EntrepreneurProductsScreen
 * - Shows a list of entrepreneur students and their products.
 * - Uses `getEntrepreneurStudents` to load entrepreneur profiles from the backend.
 * - Displays each product as a card with a title, description and optional image.
 * - Clicking a card navigates to a product detail view. There's also a button to add a new product.
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../store';
import { getEntrepreneurStudents } from '../services/api';
import type { EntrepreneurUserProfile, UserProduct } from '../types/entrepreneur';
import TopNavBar from '../components/layout/TopNavBar';

const EntrepreneurProductsScreen: React.FC = () => {
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token);
    const [profiles, setProfiles] = useState<EntrepreneurUserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProfiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getEntrepreneurStudents();
            // backend returns { data: [...] } from axios
            const data = Array.isArray(res?.data) ? res.data : [];
            setProfiles(data as any);
        } catch (err: any) {
            console.error('Failed to load entrepreneur profiles', err);
            setError(err?.message || 'Failed to load profiles');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadProfiles(); }, [loadProfiles]);

    const allProducts: Array<{ product: UserProduct; owner: EntrepreneurUserProfile }> = [];
    profiles.forEach((p) => {
        (p.userProducts || []).forEach((prod) => allProducts.push({ product: prod, owner: p }));
    });

    const onAddProduct = () => navigate('/entrepreneur/add-product');
    const onOpenProduct = (productId: number) => navigate(`/entrepreneur/product/${productId}`);

    return (
        <div className="min-h-screen bg-gray-100">
            <TopNavBar />
            <main className="max-w-6xl mx-auto p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Entrepreneur Products</h1>
                    <div>
                        <button onClick={onAddProduct} className="px-4 py-2 bg-blue-600 text-white rounded">Add Product</button>
                    </div>
                </div>

                {loading && <p>Loading products...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && allProducts.length === 0 && (
                    <div className="p-6 bg-white rounded shadow">No products found.</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {allProducts.map(({ product, owner }) => (
                        <article key={product.id} className="bg-white rounded shadow p-4 hover:shadow-lg cursor-pointer" onClick={() => onOpenProduct(product.id)}>
                            {product.title && <h2 className="text-lg font-medium">{product.title}</h2>}
                            {product.description && <p className="text-sm text-gray-600">{product.description}</p>}
                            <div className="mt-2 text-xs text-gray-500">By: {owner.user?.userFirstName || owner.user?.userEmail}</div>
                            {product.price != null && <div className="mt-2 font-semibold">Price: {product.price}</div>}
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default EntrepreneurProductsScreen;