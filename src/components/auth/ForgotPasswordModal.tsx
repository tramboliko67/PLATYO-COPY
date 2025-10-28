import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmitRequest,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await onSubmitRequest(email);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 4000);
      } else {
        setError(result.error || 'Error al enviar la solicitud');
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Recuperar Contraseña">
      {success ? (
        <div className="text-center py-8 px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            ¡Solicitud Enviada!
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Hemos recibido tu solicitud de recuperación de contraseña.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              Nuestro equipo se contactará contigo al email{' '}
              <span className="font-semibold text-blue-700">{email}</span> para ayudarte a reactivar tu cuenta.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur-xl"></div>
            <div className="relative flex items-start space-x-4 p-5 bg-white rounded-xl border border-blue-200 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                <p className="font-medium text-gray-900 mb-2">
                  ¿Olvidaste tu contraseña?
                </p>
                <p>
                  Ingresa tu dirección de email y nos pondremos en contacto contigo para ayudarte a recuperar el acceso a tu cuenta.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          {error && (
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-xl blur"></div>
              <div className="relative bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm shadow-sm">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
            >
              Enviar Solicitud
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
