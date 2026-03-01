import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  schedule: string;
}

export default function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    schedule: '',
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name', { ascending: true });

    if (data) setLocations(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('locations').insert(formData);

    if (!error) {
      setFormData({ name: '', address: '', schedule: '' });
      setShowAddForm(false);
      fetchLocations();
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Location>) => {
    const { error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchLocations();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      const { error } = await supabase.from('locations').delete().eq('id', id);
      if (!error) fetchLocations();
    }
  };

  if (loading) {
    return <div className="text-amber-200">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-50">Locations</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? 'Cancel' : 'Add Location'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-amber-900/20 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-50"
              placeholder="Downtown Farmer's Market"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-50"
              placeholder="123 Main Street, Downtown"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Schedule</label>
            <input
              type="text"
              required
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              className="w-full px-4 py-2 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-50"
              placeholder="Saturdays, 9am - 4pm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all"
          >
            Add Location
          </button>
        </form>
      )}

      <div className="space-y-4">
        {locations.map((location) => (
          <div key={location.id} className="bg-amber-900/20 p-4 rounded-lg">
            {editingId === location.id ? (
              <EditForm location={location} onSave={handleUpdate} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-50 mb-2">{location.name}</h3>
                  <p className="text-amber-200/80 mb-1">{location.address}</p>
                  <p className="text-amber-400">{location.schedule}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(location.id)}
                    className="p-2 text-amber-300 hover:bg-amber-900/40 rounded transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
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

function EditForm({ location, onSave, onCancel }: { location: Location; onSave: (id: string, updates: Partial<Location>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: location.name,
    address: location.address,
    schedule: location.schedule,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(location.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 bg-amber-950/30 border border-amber-800/50 rounded text-amber-50"
      />
      <input
        type="text"
        required
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="w-full px-3 py-2 bg-amber-950/30 border border-amber-800/50 rounded text-amber-50"
      />
      <input
        type="text"
        required
        value={formData.schedule}
        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
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
