import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import { Link } from 'react-router-dom';


const axiosInstance = axios.create({
    baseURL: 'https://api-img-ql8a.onrender.com', // Cambia la URL si es necesario
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

function ShowPc() {

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [file, setFile] = useState(null);

  // Función para cargar los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await axiosInstance.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos(); // Llamada a la API para obtener los productos
  }, []);

  // Función para eliminar un producto
  const deleteProducto = async (id) => {
    try {
      await axiosInstance.delete(`/productos/${id}`);
      setProductos(productos.filter(producto => producto.id !== id)); // Eliminar de la lista local
    } catch (error) {
      console.error('Error deleting producto:', error);
    } finally {
      setShowDeleteModal(false); // Cerrar modal de eliminación después de eliminar
    }
  };

  // Función para abrir el modal para agregar un nuevo producto
  const openModal = (producto = null) => {
    setSelectedProduct(producto);
    setDescripcion(producto ? producto.descripcion : '');
    setPrecio(producto ? producto.precio : '');
    setFile(null); // Resetea el archivo cada vez que se abre el modal
    setShowModal(true);
  };

  const openDeleteModal = (producto) => {
    setSelectedProduct(producto);
    setShowDeleteModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  // Función para manejar el submit del formulario en el modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    if (file) formData.append('file', file);

    try {
      if (selectedProduct) {
        // Actualizar producto (PUT)
        await axiosInstance.put(`/productos/${selectedProduct.id}`, formData);
      } else {
        // Crear nuevo producto (POST)
        await axiosInstance.post('/productos', formData);
      }
      fetchProductos(); // Recargar la lista de productos
      closeModal(); // Cerrar modal después de enviar
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (

    <>
    
    <div className="container mx-auto p-4">
      {/* Botón para abrir el modal de agregar nuevo producto */}
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Agregar Producto
      </button>

      {/* Tabla de productos */}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Imagen</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td className="border p-2">{producto.descripcion}</td>
                <td className="border p-2">{producto.precio}</td>
                <td className="border p-2">
                  <img
                    src={`https://api-img-ql8a.onrender.com${producto.img}`}
                    alt={producto.descripcion}
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td className="border p-2">
                  {/* Botón de editar */}
                  <button
                    onClick={() => openModal(producto)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Editar
                  </button>
                  {/* Botón de eliminar */}
                  <button
                    onClick={() => openDeleteModal(producto)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para agregar/editar producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl mb-4">{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="descripcion" className="block text-sm font-medium">Descripción</label>
                <input
                  id="descripcion"
                  type="text"
                  className="input w-full"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="precio" className="block text-sm font-medium">Precio</label>
                <input
                  id="precio"
                  type="text"
                  className="input w-full"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium">Imagen</label>
                <input
                  id="file"
                  type="file"
                  className="input w-full"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {selectedProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl mb-4">¿Deseas eliminar este producto?</h2>
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteProducto(selectedProduct.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
         )}
    </div>

    
    
     </>
  )
}

export default ShowPc