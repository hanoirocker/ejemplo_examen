'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  // Estado para los valores del formulario
  const [form, setForm] = useState({
    email: '',
    type: 'suggestion',
    message: '',
  });

  // Estado para la UI (Feedback al usuario)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Manejador para los inputs
  const HandleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const HandleSummit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el refresh de la página
    setStatus('loading');
    setErrorMsg('');

    try {
      await axios.post('/api/feedback', form);
      setStatus('success'); // Actualizamos estado a success
      setForm({
        // Limpiar form luego de enviarla al POST del back
        email: '',
        type: 'suggestion',
        message: '',
      });
    } catch (error: any) {
      setStatus('error');
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error); // Seteamos mensaje del backend como error a mostrar
      } else {
        setErrorMsg('Error inesperado');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-black">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Enviar feedback</h1>

        {/* Mensaje de estado */}
        {status === 'success' && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            Gracias! Su comentario ha sido enviado con éxito.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-100 text-green-700 p-3 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={HandleSummit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={HandleChange}
              disabled={status === 'loading'}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Type select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              name="type"
              value={form.type}
              onChange={HandleChange}
              disabled={status === 'loading'}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="suggestion">Sugerencia</option>
              <option value="bug">Reporte de Error</option>
            </select>
          </div>

          {/* Boton de Summit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
                status === 'loading'
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </main>
  );
}
