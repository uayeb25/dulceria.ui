import { API_BASE_URL, handleResponse } from "./api.js";

export const catalogService = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/catalogs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener catálogos:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/catalogs/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener catálogo:', error);
            throw error;
        }
    },

    create: async (catalog) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/catalogs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_catalog_type: catalog.id_catalog_type,
                    name: catalog.name,
                    description: catalog.description,
                    cost: parseFloat(catalog.cost),
                    discount: parseInt(catalog.discount) || 0,
                    active: catalog.active ?? true
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear catálogo:', error);
            throw error;
        }
    },

    update: async (id, catalog) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/catalogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_catalog_type: catalog.id_catalog_type,
                    name: catalog.name,
                    description: catalog.description,
                    cost: parseFloat(catalog.cost),
                    discount: parseInt(catalog.discount) || 0,
                    active: catalog.active
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar catálogo:', error);
            throw error;
        }
    },

    deactivate: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/catalogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al desactivar catálogo:', error);
            throw error;
        }
    }
};
