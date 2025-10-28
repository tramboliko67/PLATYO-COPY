import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Product, Order } from '../../types';
import { Button } from '../ui/Button';

interface OrderProductSelectorProps {
  products: Product[];
  orderItems: Order['items'];
  onAddItem: (product: Product, variationId: string, quantity: number, specialNotes?: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onShowToast: (type: 'success' | 'error', title: string, message: string, duration: number) => void;
}

export const OrderProductSelector: React.FC<OrderProductSelectorProps> = ({
  products,
  orderItems,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onShowToast,
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariationId, setSelectedVariationId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleAddProduct = () => {
    if (!selectedProductId || !selectedVariationId) {
      onShowToast('error', 'Error', 'Selecciona un producto y variación', 3000);
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      onAddItem(product, selectedVariationId, quantity);
      setSelectedProductId('');
      setSelectedVariationId('');
      setQuantity(1);
    }
  };

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Productos del Pedido</h3>

      {/* Add Product Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 gap-3">
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setSelectedVariationId('');
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar producto</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          {selectedProduct && (
            <select
              value={selectedVariationId}
              onChange={(e) => setSelectedVariationId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar variación</option>
              {selectedProduct.variations.map(variation => (
                <option key={variation.id} value={variation.id}>
                  {variation.name} - ${variation.price.toFixed(2)}
                </option>
              ))}
            </select>
          )}

          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Cantidad"
            />
            <Button
              type="button"
              onClick={handleAddProduct}
              size="sm"
              className="flex-1"
            >
              Agregar Producto
            </Button>
          </div>
        </div>
      </div>

      {/* Order Items List */}
      {orderItems.length > 0 ? (
        <div className="space-y-2 mb-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-gray-600">{item.variation.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-medium w-20 text-right">
                  ${item.total_price.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Subtotal:</span>
              <span className="text-lg font-bold text-blue-600">
                ${orderItems.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg mb-4">
          No hay productos agregados. Selecciona productos para agregar al pedido.
        </p>
      )}
    </div>
  );
};
