import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface CustomizationOption {
  id: string;
  category: string;
  name: string;
  price_modifier: number;
  is_active: boolean;
  display_order: number;
}

interface CreateYourOwnBase {
  id: string;
  type: string;
  name: string;
  base_price: number;
  description: string;
  is_active: boolean;
}

export default function AdminCustomization() {
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [bases, setBases] = useState<CreateYourOwnBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'options' | 'bases'>('options');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [optionsResponse, basesResponse] = await Promise.all([
      supabase.from('customization_options').select('*').order('category').order('display_order'),
      supabase.from('create_your_own_bases').select('*').order('type')
    ]);

    if (optionsResponse.data) setOptions(optionsResponse.data);
    if (basesResponse.data) setBases(basesResponse.data);
    setLoading(false);
  };

  const handleDeleteOption = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from('customization_options').delete().eq('id', id);
      fetchData();
    }
  };

  const handleDeleteBase = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from('create_your_own_bases').delete().eq('id', id);
      fetchData();
    }
  };

  const toggleOptionActive = async (id: string, currentState: boolean) => {
    await supabase.from('customization_options').update({ is_active: !currentState }).eq('id', id);
    fetchData();
  };

  const toggleBaseActive = async (id: string, currentState: boolean) => {
    await supabase.from('create_your_own_bases').update({ is_active: !currentState }).eq('id', id);
    fetchData();
  };

  const groupedOptions = options.reduce((acc, option) => {
    if (!acc[option.category]) acc[option.category] = [];
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, CustomizationOption[]>);

  if (loading) return <div className="text-amber-200">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-amber-800/30 pb-4">
        <button
          onClick={() => setActiveTab('options')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'options'
              ? 'bg-amber-600 text-white'
              : 'text-amber-200 hover:bg-amber-900/40'
          }`}
        >
          Customization Options
        </button>
        <button
          onClick={() => setActiveTab('bases')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'bases'
              ? 'bg-amber-600 text-white'
              : 'text-amber-200 hover:bg-amber-900/40'
          }`}
        >
          Create Your Own Bases
        </button>
      </div>

      {activeTab === 'options' ? (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-amber-50">Customization Options</h2>
          {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-amber-200 mb-4 capitalize">{category}</h3>
              <div className="space-y-2">
                {categoryOptions.map((option) => (
                  <div key={option.id} className="bg-amber-900/20 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-amber-100 font-medium">{option.name}</span>
                      {option.price_modifier !== 0 && (
                        <span className="ml-3 text-amber-400">
                          {option.price_modifier > 0 ? '+' : ''}${option.price_modifier.toFixed(2)}
                        </span>
                      )}
                      {!option.is_active && (
                        <span className="ml-3 text-red-400 text-sm">(Inactive)</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleOptionActive(option.id, option.is_active)}
                        className={`px-3 py-1 rounded text-sm transition-all ${
                          option.is_active
                            ? 'bg-green-900/40 text-green-300'
                            : 'bg-red-900/40 text-red-300'
                        }`}
                      >
                        {option.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDeleteOption(option.id)}
                        className="p-2 text-red-400 hover:bg-red-900/40 rounded transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-50">Create Your Own Bases</h2>
          <div className="space-y-4">
            {bases.map((base) => (
              <div key={base.id} className="bg-amber-900/20 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-amber-50">{base.name}</h3>
                      <span className="px-2 py-1 bg-amber-700/30 text-amber-200 text-xs rounded uppercase">
                        {base.type}
                      </span>
                      {!base.is_active && (
                        <span className="text-red-400 text-sm">(Inactive)</span>
                      )}
                    </div>
                    <p className="text-amber-200/80 mb-2">{base.description}</p>
                    <p className="text-amber-400 font-semibold">${base.base_price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBaseActive(base.id, base.is_active)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        base.is_active
                          ? 'bg-green-900/40 text-green-300'
                          : 'bg-red-900/40 text-red-300'
                      }`}
                    >
                      {base.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDeleteBase(base.id)}
                      className="p-2 text-red-400 hover:bg-red-900/40 rounded transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
