import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import { Link } from 'react-router-dom';


const axiosInstance = axios.create({
    baseURL: 'https://api-student-omega.vercel.app', // Cambia la URL si es necesario
  });

function ShowPc() {

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [nombre, setNommbre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [calificacion, setcalificacion] = useState(null);

  // Función para cargar los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await axiosInstance.get('/api/student');
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
      await axiosInstance.delete(`/api/student/${id}`);
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
    setNommbre(producto ? producto.nombre : '');
    setApellido(producto ? producto.apellido : '');
    setEdad(producto ? producto.edad : '');
    setcalificacion(producto ? producto.calificacion : ''); // Resetea el archivo cada vez que se abre el modal
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
    const data = {
          nombre,
          apellido,
          edad,
          calificacion
        };

    // if (calificacion) formData.append('calificacion', calificacion);

    try {
      if (selectedProduct) {
        // Actualizar producto (PUT)
        await axiosInstance.put(`/api/student/${selectedProduct.id}`, data);
      } else {
        // Crear nuevo producto (POST)
        await axiosInstance.post('/api/student', data);
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
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Apellido</th>
              <th className="border p-2">Edad</th>
              <th className="border p-2">Calificacion</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td className="border p-2">{producto.nombre}</td>
                <td className="border p-2">{producto.apellido}</td>
                <td className="border p-2">{producto.edad}</td>
                <td className="border p-2">{producto.calificacion}</td>
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
                <label htmlFor="nombre" className="block text-sm font-medium">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  className="input w-full"
                  value={nombre}
                  onChange={(e) => setNommbre(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="apellido" className="block text-sm font-medium">apellido</label>
                <input
                  id="apellido"
                  type="text"
                  className="input w-full"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edad" className="block text-sm font-medium">edad</label>
                <input
                  id="edad"
                  type="text"
                  className="input w-full"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="calificacion" className="block text-sm font-medium">calificacion</label>
                <input
                  id="calificacion"
                  type="text"
                  className="input w-full"
                  value={calificacion}
                  onChange={(e) => setcalificacion(e.target.value)}
                  required
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
            <h2 className="text-xl mb-4">¿Deseas eliminar este alumno {selectedProduct.nombre}?</h2>
           
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