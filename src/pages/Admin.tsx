import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Package, Users, ClipboardList, DollarSign, Search, ShieldAlert, Loader2 } from 'lucide-react';

type Status = 'pending' | 'processing' | 'quoted' | 'shipped' | 'delivered' | 'cancelled';

type ProductRequest = {
  id: string;
  product_name: string;
  description: string | null;
  quantity: number;
  shipping_method: 'air' | 'sea' | 'dropshipping';
  status: Status;
  budget: number | null;
  product_cost: number | null;
  shipping_cost: number | null;
  service_fee: number | null;
  total_cost: number | null;
  tracking_number: string | null;
  admin_notes: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  user_id: string | null;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  created_at: string;
};

const statusOptions: Status[] = ['pending', 'processing', 'quoted', 'shipped', 'delivered', 'cancelled'];

const statusBadge: Record<Status, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-warning/15 text-warning',
  quoted: 'bg-primary-soft text-primary',
  shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  delivered: 'bg-success/15 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [editing, setEditing] = useState<ProductRequest | null>(null);
  const [saving, setSaving] = useState(false);

  // Auth + admin check
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin',
      });
      if (!active) return;
      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
      setChecking(false);
    })();
    return () => { active = false; };
  }, [navigate]);

  // Load data
  const loadData = async () => {
    setLoading(true);
    const [{ data: reqs }, { data: profs }] = await Promise.all([
      supabase.from('product_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    setRequests((reqs as ProductRequest[]) ?? []);
    setProfiles((profs as Profile[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const inProgress = requests.filter(r => ['processing', 'quoted', 'shipped'].includes(r.status)).length;
    const revenue = requests
      .filter(r => r.status === 'delivered')
      .reduce((s, r) => s + (Number(r.total_cost) || 0), 0);
    return { total, pending, inProgress, clients: profiles.length, revenue };
  }, [requests, profiles]);

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q
        || r.product_name.toLowerCase().includes(q)
        || (r.contact_email ?? '').toLowerCase().includes(q)
        || (r.contact_whatsapp ?? '').toLowerCase().includes(q)
        || (r.tracking_number ?? '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  const filteredProfiles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(p =>
      (p.full_name ?? '').toLowerCase().includes(q)
      || (p.email ?? '').toLowerCase().includes(q)
      || (p.phone ?? '').toLowerCase().includes(q)
      || (p.whatsapp ?? '').toLowerCase().includes(q),
    );
  }, [profiles, search]);

  const quickStatusUpdate = async (id: string, status: Status) => {
    const { error } = await supabase.from('product_requests').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast({ title: 'Status updated' });
  };

  const saveRequest = async () => {
    if (!editing) return;
    setSaving(true);
    const productCost = Number(editing.product_cost) || 0;
    const shippingCost = Number(editing.shipping_cost) || 0;
    const serviceFee = Number(editing.service_fee) || 0;
    const total = productCost + shippingCost + serviceFee || null;
    const payload = {
      status: editing.status,
      product_cost: editing.product_cost,
      shipping_cost: editing.shipping_cost,
      service_fee: editing.service_fee,
      total_cost: total,
      tracking_number: editing.tracking_number || null,
      admin_notes: editing.admin_notes || null,
    };
    const { error } = await supabase.from('product_requests').update(payload).eq('id', editing.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Request saved' });
    setEditing(null);
    loadData();
  };

  if (checking) {
    return (
      <Layout>
        <div className="container-app py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container-app py-20 text-center max-w-md mx-auto">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin access required</h1>
          <p className="text-muted-foreground mb-6">
            Your account does not have admin privileges. Contact the platform owner to request access.
          </p>
          <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-app py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage clients, requests, and orders.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users className="h-5 w-5" />} label="Clients" value={stats.clients} />
          <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Total requests" value={stats.total} />
          <StatCard icon={<Package className="h-5 w-5" />} label="Pending" value={stats.pending} highlight />
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Revenue (MAD)" value={stats.revenue.toLocaleString()} />
        </div>

        <Tabs defaultValue="requests">
          <TabsList>
            <TabsTrigger value="requests">Requests ({stats.total})</TabsTrigger>
            <TabsTrigger value="clients">Clients ({stats.clients})</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, tracking..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <TabsContent value="requests" className="m-0">
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as Status | 'all')}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </TabsContent>
          </div>

          <TabsContent value="requests">
            <div className="border rounded-2xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No requests found</TableCell></TableRow>
                  ) : filteredRequests.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-medium">{r.product_name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{r.contact_email || '—'}</div>
                        <div className="text-xs text-muted-foreground">{r.contact_whatsapp || ''}</div>
                      </TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell className="uppercase text-xs">{r.shipping_method}</TableCell>
                      <TableCell className="font-semibold">{r.total_cost ? `${Number(r.total_cost).toLocaleString()} MAD` : '—'}</TableCell>
                      <TableCell>
                        <Select value={r.status} onValueChange={(v) => quickStatusUpdate(r.id, v as Status)}>
                          <SelectTrigger className={`h-8 text-xs font-semibold border-0 w-32 ${statusBadge[r.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-end">
                        <Button size="sm" variant="outline" onClick={() => setEditing(r)}>Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="clients">
            <div className="border rounded-2xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-end">Requests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                  ) : filteredProfiles.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No clients found</TableCell></TableRow>
                  ) : filteredProfiles.map(p => {
                    const count = requests.filter(r => r.user_id === p.id).length;
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.full_name || '—'}</TableCell>
                        <TableCell>{p.email || '—'}</TableCell>
                        <TableCell>{p.phone || '—'}</TableCell>
                        <TableCell>{p.whatsapp || '—'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-end font-semibold">{count}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Request Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle>{editing.product_name}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                {editing.description && (
                  <div className="text-sm bg-muted/50 p-3 rounded-lg">
                    <div className="font-semibold mb-1">Client description</div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{editing.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Quantity" value={editing.quantity.toString()} />
                  <Info label="Shipping" value={editing.shipping_method.toUpperCase()} />
                  <Info label="Email" value={editing.contact_email || '—'} />
                  <Info label="WhatsApp" value={editing.contact_whatsapp || '—'} />
                  <Info label="Budget" value={editing.budget ? `${editing.budget} MAD` : '—'} />
                  <Info label="Submitted" value={new Date(editing.created_at).toLocaleString()} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status">
                    <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as Status })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Tracking number">
                    <Input
                      value={editing.tracking_number ?? ''}
                      onChange={e => setEditing({ ...editing, tracking_number: e.target.value })}
                      placeholder="e.g. SQ-12345"
                    />
                  </Field>
                  <Field label="Product cost (MAD)">
                    <Input type="number" value={editing.product_cost ?? ''} onChange={e => setEditing({ ...editing, product_cost: e.target.value ? Number(e.target.value) : null })} />
                  </Field>
                  <Field label="Shipping cost (MAD)">
                    <Input type="number" value={editing.shipping_cost ?? ''} onChange={e => setEditing({ ...editing, shipping_cost: e.target.value ? Number(e.target.value) : null })} />
                  </Field>
                  <Field label="Service fee (MAD)">
                    <Input type="number" value={editing.service_fee ?? ''} onChange={e => setEditing({ ...editing, service_fee: e.target.value ? Number(e.target.value) : null })} />
                  </Field>
                  <Field label="Total (auto)">
                    <Input
                      disabled
                      value={((Number(editing.product_cost) || 0) + (Number(editing.shipping_cost) || 0) + (Number(editing.service_fee) || 0)).toLocaleString() + ' MAD'}
                    />
                  </Field>
                </div>

                <Field label="Admin notes (private)">
                  <Textarea
                    rows={3}
                    value={editing.admin_notes ?? ''}
                    onChange={e => setEditing({ ...editing, admin_notes: e.target.value })}
                    placeholder="Internal notes about this request..."
                  />
                </Field>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={saveRequest} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`p-5 rounded-2xl border bg-card ${highlight ? 'border-primary/30' : ''}`}>
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
        <span className={highlight ? 'text-primary' : ''}>{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
