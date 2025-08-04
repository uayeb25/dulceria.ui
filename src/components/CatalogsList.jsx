import { useState, useEffect } from 'react';
import { catalogService, catalogTypeService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import CatalogForm from './CatalogForm';

const CatalogsList = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [catalogTypes, setCatalogTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => {
                setRecentlyUpdated(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            // Cargamos los catálogos (ya incluyen catalog_type_description)
            const catalogsData = await catalogService.getAll();
            setCatalogs(catalogsData["catalogs"]);

            // Cargamos los tipos de catálogo para el formulario
            try {
                const catalogTypesData = await catalogTypeService.getAll();
                setCatalogTypes(catalogTypesData);
            } catch (typeError) {
                console.warn('Error al cargar tipos de catálogo:', typeError);
                setCatalogTypes([]);
            }

        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            setError(error.message || 'Error al cargar los catálogos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!validateToken()) {
            return;
        }

        const confirmed = window.confirm(
            `¿Estás seguro de eliminar el catálogo "${item.name}"?\n\nEsta acción no se puede deshacer.`
        );

        if (confirmed) {
            try {
                setError('');
                await catalogService.deactivate(item.id);
                
                await loadData();
                setSuccessMessage('Catálogo eliminado exitosamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
                setError(error.message || 'Error al eliminar el catálogo');
            }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadData();
        
        setRecentlyUpdated(savedItem.id);

        const message = isEdit ? 'Catálogo actualizado exitosamente' : 'Catálogo creado exitosamente';
        setSuccessMessage(message);
        
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const getCatalogTypeName = (catalog) => {
        return catalog.catalog_type_description || 'Tipo no encontrado';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
        }).format(amount);
    };

    const calculateFinalPrice = (cost, discount) => {
        const discountAmount = (cost * discount) / 100;
        return cost - discountAmount;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Cargando catálogos...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Catálogos</h1>
                <button
                    onClick={handleCreate}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Catálogo
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Costo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descuento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio Final
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {catalogs.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No hay catálogos registrados
                                </td>
                            </tr>
                        ) : (
                            catalogs.map((item) => (
                                <tr 
                                    key={item.id} 
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === item.id 
                                            ? 'bg-green-50 border-l-4 border-green-400' 
                                            : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {getCatalogTypeName(item)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(item.cost)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.discount > 0 ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                                {item.discount}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Sin descuento</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.discount > 0 ? (
                                            <div className="flex flex-col">
                                                <span className="text-green-600">{formatCurrency(calculateFinalPrice(item.cost, item.discount))}</span>
                                                <span className="text-xs text-gray-400 line-through">{formatCurrency(item.cost)}</span>
                                            </div>
                                        ) : (
                                            formatCurrency(item.cost)
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        {item.active && (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <CatalogForm
                    item={editingItem}
                    catalogTypes={catalogTypes}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default CatalogsList;
