import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Classic',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true });

    if (data) setItems(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('menu_items').insert({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
    });

    if (!error) {
      setFormData({ name: '', description: '', price: '', category: 'Classic' });
      setShowAddForm(false);
      fetchItems();
    }
  };

  const handleUpdate = async (id: string, updates: Partial<MenuItem>) => {
    const { error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (!error) fetchItems();
    }
  };

  if (loading) {
    return <div className="text-amber-200">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-50">Menu Items</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-amber-900/20 p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-200 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-200 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-50"
              >
                <option>Classic</option>
                <option>Specialty</option>
                <option>Seasonal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-50"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-50"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all"
          >
            Add Item
          </button>
        </form>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-amber-900/20 p-4 rounded-lg">
            {editingId === item.id ? (
              <EditForm item={item} onSave={handleUpdate} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-amber-50">{item.name}</h3>
                    <span className="px-2 py-1 bg-amber-700/30 text-amber-200 text-xs rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-amber-200/80 mb-2">{item.description}</p>
                  <p className="text-amber-400 font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="p-2 text-amber-300 hover:bg-amber-900/40 rounded transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-900/40 rounded transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditForm({ item, onSave, onCancel }: { item: MenuItem; onSave: (id: string, updates: Partial<MenuItem>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    price: item.price.toString(),
    category: item.category,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 bg-amber-950/30 border border-amber-800/50 rounded text-amber-50"
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="px-3 py-2 bg-amber-950/30 border border-amber-800/50 rounded text-amber-50"
        >
          <option>Classic</option>
          <option>Specialty</option>
          <option>Seasonal</option>
        </select>
      </div>
      <textarea
        required
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-3 py-2 bg-amber-950/30 border border-amber-800/50 rounded text-amber-50"
        rows={2}
      />
      <input
        type="number"
        step="0.01"
        required
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="w-full px-3 py-2 bg-amber-950/30 border border-amber-800/50 rounded text-amber-50"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-all"
        >
          <Save size={18} />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-amber-900/40 hover:bg-amber-900/60 text-amber-200 rounded transition-all"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
}
