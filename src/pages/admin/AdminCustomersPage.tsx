import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, phone, created_at')
          .order('created_at', { ascending: false });
        setCustomers(data || []);
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1 text-plum/60 hover:text-plum text-sm font-medium mb-6">
        <ArrowLeft size={16}/> Back to Dashboard
      </Link>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-soft-blush flex items-center justify-center text-plum">
          <Users size={20} />
        </div>
        <h1 className="font-playfair text-4xl text-plum">Customers</h1>
      </div>
      <p className="text-secondary-text mb-8">Registered customer accounts from database profiles.</p>

      {loading ? (
        <div className="text-plum/60 text-center py-12">Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="bg-warm-white rounded-3xl p-12 text-center border border-subtle-border">
          <p className="text-secondary-text">No registered customer accounts found in the database.</p>
        </div>
      ) : (
        <div className="bg-warm-white rounded-3xl shadow-xl border border-subtle-border overflow-x-auto">
          <table className="w-full text-sm text-plum/80">
            <thead className="bg-soft-blush/40 border-b border-subtle-border">
              <tr>
                <th className="text-left p-4 font-bold text-plum">Customer</th>
                <th className="text-left p-4 font-bold text-plum">Phone</th>
                <th className="text-left p-4 font-bold text-plum">Customer ID</th>
                <th className="text-left p-4 font-bold text-plum">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-subtle-border/60 hover:bg-ivory/50 transition-colors">
                  <td className="p-4 font-medium text-plum">{c.full_name || 'Customer'}</td>
                  <td className="p-4">{c.phone || '-'}</td>
                  <td className="p-4 text-xs font-mono text-secondary-text">{c.id?.slice(0, 8)}...</td>
                  <td className="p-4 text-xs text-secondary-text">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
