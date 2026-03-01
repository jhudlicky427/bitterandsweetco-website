import { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

interface CheckoutModalProps {
  drink: {
    name: string;
    price: number;
    description: string;
  };
  onClose: () => void;
  onComplete: () => void;
}

export default function CheckoutModal({ drink, onClose, onComplete }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    zipCode: '',
  });
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }

    if (name === 'zipCode') {
      value = value.replace(/\D/g, '');
      if (value.length > 5) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-900/95 to-amber-950/95 rounded-2xl max-w-md w-full border-2 border-amber-600/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-800 to-amber-900 p-6 border-b border-amber-700/50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-amber-50">Checkout</h3>
            <p className="text-amber-200/80 text-sm mt-1">{drink.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-amber-50 transition-colors p-2 hover:bg-amber-800/50 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-amber-800/30 rounded-lg p-4 border border-amber-700/30">
            <div className="flex justify-between items-center">
              <span className="text-amber-100 font-medium">Order Total:</span>
              <span className="text-2xl font-bold text-amber-400">${drink.price.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-amber-300 mb-4">
              <Lock size={16} />
              <span className="text-sm">Secure Payment</span>
            </div>

            <div>
              <label className="block text-amber-100 font-medium mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="w-full px-4 py-3 bg-amber-950/50 border border-amber-700/50 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-amber-100 font-medium mb-2">Cardholder Name</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-amber-950/50 border border-amber-700/50 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-amber-100 font-medium mb-2 text-sm">Expiry</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                  className="w-full px-3 py-3 bg-amber-950/50 border border-amber-700/50 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-amber-100 font-medium mb-2 text-sm">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  required
                  className="w-full px-3 py-3 bg-amber-950/50 border border-amber-700/50 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-amber-100 font-medium mb-2 text-sm">ZIP</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="12345"
                  required
                  className="w-full px-3 py-3 bg-amber-950/50 border border-amber-700/50 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay $${drink.price.toFixed(2)}`}
            </button>

            <p className="text-amber-300/60 text-xs text-center mt-3">
              This is a demo checkout. No actual payment will be processed.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
