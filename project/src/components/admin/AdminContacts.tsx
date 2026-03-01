import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Mail } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setContacts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (!error) fetchContacts();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-amber-200">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-50">Contact Form Submissions</h2>
          <p className="text-amber-200/60 mt-1">{contacts.length} total submissions</p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 text-amber-200/60">
          No contact submissions yet
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-amber-900/20 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-900/40 rounded text-amber-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-50">{contact.name}</h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 text-red-400 hover:bg-red-900/40 rounded transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-amber-200/60 text-sm mb-2">Message</p>
                <p className="text-amber-100 bg-amber-950/30 p-4 rounded leading-relaxed">
                  {contact.message}
                </p>
              </div>

              <div className="pt-4 border-t border-amber-800/30">
                <p className="text-amber-200/40 text-xs">
                  Submitted {formatDate(contact.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
