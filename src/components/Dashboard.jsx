import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Dashboard = () => {

    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return(
        <div className="min-h-screen bg-green-50">
        {/* Header Principal */}
        <div className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
            {/* Top Header - Saludo y Logout */}
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <div>
                <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido a la Dulcería! 🍭</h1>
                <p className="text-gray-600">Hola { `${user.firstname} ${user.lastname}` } </p>
                </div>
                <button 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                onClick={handleLogout}
                >
                Cerrar Sesión
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="py-4">
                <ul className="flex space-x-8">
                <li>
                    <button className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium">
                    <span className="mr-2">🏷️</span>
                    Tipos
                    </button>
                </li>
                <li>
                    <button className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium">
                    <span className="mr-2">🍬</span>
                    Productos
                    </button>
                </li>
                </ul>
            </nav>
            </div>
        </div>

        {/* Contenido Principal */}
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Selecciona una opción del menú para comenzar
            </h2>
            <p className="text-gray-500">
                Usa el menú de arriba para navegar entre los módulos de Tipos y Productos
            </p>
            </div>
        </div>
        </div>
    )

}

export default Dashboard