import { create } from 'zustand';
import { supabase, createEphemeralAuthClient } from '@/lib/api';
import type {
  AuthUser, BackendRole, UserProfile, InventoryItem, Vendor,
  MaterialRequest, CreateRequestDTO, PurchaseOrder, PurchaseOrderStatus,
  RequestStatus, Notification, AuditLog, Task, StockLevel,
} from '@/types';

interface ToastMsg {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppState {
  currentUser: AuthUser | null;
  users: UserProfile[];
  inventory: InventoryItem[];
  vendors: Vendor[];
  requests: MaterialRequest[];
  purchaseOrders: PurchaseOrder[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  tasks: Task[];
  toasts: ToastMsg[];
  loading: boolean;
  error: string | null;

  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  createAdminUser: (data: {
    fullName: string; email: string; role: BackendRole; department: string; phoneNumber?: string;
  }) => Promise<string>;
  changePassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;

  fetchUsers: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  fetchVendors: () => Promise<void>;
  fetchAllRequests: () => Promise<void>;
  fetchPurchaseOrders: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchTasks: () => Promise<void>;

  createRequest: (data: CreateRequestDTO) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus) => Promise<void>;
  updatePOStatus: (id: string, status: PurchaseOrderStatus) => Promise<void>;

  addInventoryItem: (data: { name: string; quantity: number; unitPrice: number; unit: string; reorderLevel: number }) => Promise<void>;
  updateInventoryItem: (id: string, data: { quantity?: number; unitPrice?: number; reorderLevel?: number; name?: string }) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;

  addVendor: (data: { name: string; contactPerson?: string; contactName?: string; email: string; phone: string }) => Promise<void>;
  updateVendor: (id: string, data: { name: string; contactPerson?: string; contactName?: string; email: string; phone: string }) => Promise<void>;

  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  addToast: (type: ToastMsg['type'], message: string) => void;
  removeToast: (id: string) => void;
  dismissToast: (id: string) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

const roleMap: Record<string, BackendRole> = {
  admin: 'ADMIN',
  ADMIN: 'ADMIN',
  requisitioner: 'RECEIVER',
  RECEIVER: 'RECEIVER',
  procurement_officer: 'PROCUREMENT',
  PROCUREMENT: 'PROCUREMENT',
};

const reverseRoleMap: Record<BackendRole, string> = {
  ADMIN: 'admin',
  RECEIVER: 'requisitioner',
  PROCUREMENT: 'procurement_officer',
};

function computeStockLevel(qty: number, reorder: number): StockLevel {
  if (qty <= 0) return 'CRITICAL';
  if (qty <= reorder) return 'LOW';
  return 'OK';
}

function mapProfileToAuth(p: { id: string; name: string; department: string; role: string; must_change_password?: boolean }): AuthUser {
  return {
    id: p.id,
    userId: p.id,
    email: '',
    name: p.name,
    username: p.name,
    role: roleMap[p.role] || 'RECEIVER',
    department: p.department,
    mustChangePassword: !!p.must_change_password,
  };
}

function mapInventoryRow(row: Record<string, unknown>): InventoryItem {
  const quantity = Number(row.quantity) || 0;
  const reorderLevel = Number(row.reorder_level) || 0;
  const unitPrice = Number(row.unit_price) || 0;
  const name = row.name as string;
  return {
    id: row.id as string,
    sku: row.sku as string,
    name,
    material: name,
    category: row.category as string,
    quantity,
    unit: row.unit as string,
    reorderLevel,
    minStockLevel: reorderLevel,
    location: row.location as string,
    unitPrice,
    price: unitPrice,
    stockLevel: (row.stock_level as StockLevel) || computeStockLevel(quantity, reorderLevel),
    lastUpdated: row.last_updated as string,
  };
}

function mapVendorRow(row: Record<string, unknown>): Vendor {
  const contactPerson = row.contact_person as string;
  return {
    id: row.id as string,
    name: row.name as string,
    contactPerson,
    contactName: contactPerson,
    email: row.email as string,
    phone: row.phone as string,
    address: row.address as string,
    category: row.category as string,
    rating: Number(row.rating) || 0,
    totalOrders: Number(row.total_orders) || 0,
    onTimeRate: Number(row.on_time_rate) || 0,
    status: row.status as string,
    joinedDate: row.joined_date as string,
  };
}

function mapRequestRow(row: Record<string, unknown>): MaterialRequest {
  const createdAt = row.created_at as string;
  const requesterName = row.requester_name as string;
  return {
    id: row.id as string,
    prNumber: row.pr_number as string,
    title: row.title as string,
    description: row.description as string,
    requesterId: row.requester_id as string,
    requesterName,
    requestedBy: requesterName,
    department: row.department as string,
    status: (row.status as RequestStatus) || 'PENDING',
    priority: row.priority as string,
    items: row.items as unknown[],
    material: row.material as string,
    quantity: Number(row.quantity) || 0,
    location: row.location as string,
    createdAt,
    date: createdAt,
    updatedAt: row.updated_at as string,
    neededBy: row.needed_by as string,
    totalValue: Number(row.total_value) || 0,
    assignedOfficerId: row.assigned_officer_id as string | null,
    poId: row.po_id as string | null,
  };
}

function mapPORow(row: Record<string, unknown>): PurchaseOrder {
  const createdAt = row.created_at as string;
  const supplier = row.supplier as string;
  return {
    id: row.id as string,
    poNumber: row.po_number as string,
    prId: row.pr_id as string | null,
    prNumber: row.pr_number as string | null,
    supplier,
    vendor: supplier,
    supplierId: row.supplier_id as string,
    items: row.items as unknown[],
    status: (row.status as PurchaseOrderStatus) || 'CREATED',
    totalValue: Number(row.total_value) || 0,
    createdAt,
    date: createdAt,
    expectedDelivery: row.expected_delivery as string,
    actualDelivery: row.actual_delivery as string | null,
    assignedOfficerId: row.assigned_officer_id as string,
    trackingNumber: row.tracking_number as string | null,
    material: row.material as string,
    quantity: Number(row.quantity) || 0,
    notes: row.notes as string | null,
  };
}

function mapNotificationRow(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as string,
    title: row.title as string,
    message: row.message as string,
    isRead: row.read as boolean,
    timestamp: row.timestamp as string,
    relatedId: row.related_id as string | null,
  };
}

function mapAuditRow(row: Record<string, unknown>): AuditLog {
  const actor = row.actor as string;
  const details = row.details as string;
  const resource = row.resource as string;
  return {
    id: row.id as string,
    actor,
    user: actor,
    actorRole: row.actor_role as string,
    action: row.action as string,
    resource,
    module: resource,
    resourceId: row.resource_id as string,
    details,
    description: details,
    timestamp: row.timestamp as string,
    ipAddress: row.ip_address as string,
  };
}

function mapTaskRow(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    type: row.type as string,
    title: row.title as string,
    description: row.description as string,
    assigneeId: row.assignee_id as string,
    assigneeName: row.assignee_name as string,
    relatedId: row.related_id as string,
    relatedType: row.related_type as string,
    status: row.status as string,
    priority: row.priority as string,
    dueDate: row.due_date as string,
    createdAt: row.created_at as string,
    completedAt: row.completed_at as string | null,
  };
}

function mapProfileRow(row: Record<string, unknown>): UserProfile {
  const name = row.name as string;
  return {
    id: row.id as string,
    name,
    username: name,
    fullName: name,
    email: '',
    phoneNumber: (row.phone_number as string) || '',
    department: row.department as string,
    role: roleMap[row.role as string] || 'RECEIVER',
    status: row.status as string,
    avatarColor: row.avatar_color as string,
    joinedDate: row.joined_date as string,
    lastActive: row.last_active as string | null,
  };
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  inventory: [],
  vendors: [],
  requests: [],
  purchaseOrders: [],
  notifications: [],
  auditLogs: [],
  tasks: [],
  toasts: [],
  loading: false,
  error: null,
  sidebarCollapsed: false,
  mobileNavOpen: false,

  initAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile, error } = await supabase
        .from('procurex_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      if (error || !profile) return;
      const authUser: AuthUser = {
        id: profile.id,
        userId: profile.id,
        email: session.user.email || '',
        name: profile.name,
        username: profile.name,
        role: roleMap[profile.role] || 'RECEIVER',
        department: profile.department,
        mustChangePassword: !!profile.must_change_password,
      };
      set({ currentUser: authUser });
    } catch (error) {
      console.error('Unable to restore the saved session', error);
    }
  },

  login: async (email, password) => {
    set({ error: null, loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false, error: error.message });
      throw new Error(error.message);
    }
    const userId = data.user?.id;
    if (!userId) {
      set({ loading: false });
      throw new Error('No user id returned');
    }
    const { data: profile, error: profileError } = await supabase
      .from('procurex_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (profileError || !profile) {
      set({ loading: false, error: 'Profile not found' });
      throw new Error('Profile not found');
    }
    const authUser: AuthUser = {
      id: profile.id,
      userId: profile.id,
      email,
      name: profile.name,
      username: profile.name,
      role: roleMap[profile.role] || 'RECEIVER',
      department: profile.department,
      mustChangePassword: !!profile.must_change_password,
    };
    set({ currentUser: authUser, loading: false });
  },

  createAdminUser: async (data) => {
    const tempPassword = 'TempPass123!';
    const ephemeral = createEphemeralAuthClient();
    const { data: authData, error } = await ephemeral.auth.signUp({
      email: data.email,
      password: tempPassword,
      options: {
        data: {
          fullName: data.fullName,
          department: data.department,
          role: data.role,
        },
      },
    });
    await ephemeral.auth.signOut();
    if (error) throw new Error(error.message);
    const userId = authData.user?.id;
    if (userId) {
      await supabase.from('procurex_profiles').update({ 
        must_change_password: true,
        role: data.role,
        phone_number: data.phoneNumber
      }).eq('id', userId);
    }
    await get().fetchUsers();
    get().addToast('success', `User created. Temporary password: ${tempPassword}`);
    return tempPassword;
  },

  changePassword: async (password) => {
    const user = get().currentUser;
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    const { error: profileError } = await supabase
      .from('procurex_profiles')
      .update({ must_change_password: false })
      .eq('id', user.id);
    if (profileError) throw new Error(profileError.message);
    set(state => ({
      currentUser: state.currentUser ? { ...state.currentUser, mustChangePassword: false } : null,
    }));
    get().addToast('success', 'Password updated');
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null, users: [], inventory: [], vendors: [], requests: [], purchaseOrders: [], notifications: [], auditLogs: [], tasks: [] });
  },

  fetchUsers: async () => {
    const { data, error } = await supabase.from('procurex_profiles').select('*');
    if (error) { get().addToast('error', 'Failed to load users'); return; }
    set({ users: (data || []).map(mapProfileRow) });
  },

  fetchInventory: async () => {
    const { data, error } = await supabase.from('procurex_inventory').select('*');
    if (error) { get().addToast('error', 'Failed to load inventory'); return; }
    set({ inventory: (data || []).map(mapInventoryRow) });
  },

  fetchVendors: async () => {
    const { data, error } = await supabase.from('procurex_suppliers').select('*');
    if (error) { get().addToast('error', 'Failed to load vendors'); return; }
    set({ vendors: (data || []).map(mapVendorRow) });
  },

  fetchAllRequests: async () => {
    const { data, error } = await supabase.from('procurex_purchase_requests').select('*');
    if (error) { get().addToast('error', 'Failed to load requests'); return; }
    set({ requests: (data || []).map(mapRequestRow) });
  },

  fetchPurchaseOrders: async () => {
    const { data, error } = await supabase.from('procurex_purchase_orders').select('*');
    if (error) { get().addToast('error', 'Failed to load purchase orders'); return; }
    set({ purchaseOrders: (data || []).map(mapPORow) });
  },

  fetchNotifications: async () => {
    const user = get().currentUser;
    if (!user) return;
    const { data, error } = await supabase.from('procurex_notifications').select('*').eq('user_id', user.id);
    if (error) { get().addToast('error', 'Failed to load notifications'); return; }
    set({ notifications: (data || []).map(mapNotificationRow) });
  },

  fetchAuditLogs: async () => {
    const { data, error } = await supabase.from('procurex_audit_logs').select('*').order('timestamp', { ascending: false }).limit(100);
    if (error) { get().addToast('error', 'Failed to load audit logs'); return; }
    set({ auditLogs: (data || []).map(mapAuditRow) });
  },

  fetchTasks: async () => {
    const user = get().currentUser;
    if (!user) return;
    const { data, error } = await supabase.from('procurex_tasks').select('*').eq('assignee_id', user.id);
    if (error) { get().addToast('error', 'Failed to load tasks'); return; }
    set({ tasks: (data || []).map(mapTaskRow) });
  },

  createRequest: async (data) => {
    const user = get().currentUser;
    if (!user) throw new Error('Not authenticated');
    const now = new Date().toISOString();
    const prNumber = `PR-${Date.now().toString().slice(-6)}`;
    const { data: row, error } = await supabase.from('procurex_purchase_requests').insert({
      pr_number: prNumber,
      title: data.material,
      description: data.description || '',
      requester_id: user.id,
      requester_name: user.name,
      department: user.department,
      status: 'PENDING',
      priority: 'medium',
      items: [],
      material: data.material,
      quantity: data.quantity,
      location: data.location,
      created_at: now,
      updated_at: now,
      needed_by: data.neededBy || null,
      total_value: 0,
    }).select('*').single();
    if (error) { get().addToast('error', 'Failed to create request'); throw new Error(error.message); }

    // Create a task for Admins to review the new request
    const { data: adminProfiles } = await supabase.from('procurex_profiles').select('id').eq('role', 'ADMIN');
    if (adminProfiles && adminProfiles.length > 0) {
      await Promise.all(adminProfiles.map(admin => 
        supabase.from('procurex_tasks').insert({
          type: 'APPROVAL',
          title: `Approve Request: ${prNumber}`,
          description: `${user.name} requested ${data.quantity}x ${data.material}. Deadline: ${data.neededBy || 'None'}`,
          assignee_id: admin.id,
          assignee_name: 'Administrator',
          related_id: row.id,
          related_type: 'REQUEST',
          status: 'PENDING',
          priority: 'high',
          due_date: data.neededBy || now,
          created_at: now
        })
      ));
    }

    set(state => ({ requests: [mapRequestRow(row as Record<string, unknown>), ...state.requests] }));
    get().addToast('success', 'Request submitted successfully');
  },

  updateRequestStatus: async (id, status) => {
    const user = get().currentUser;
    const { error } = await supabase.from('procurex_purchase_requests')
      .update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { get().addToast('error', 'Failed to update request'); return; }
    
    if (user) {
      await supabase.from('procurex_audit_logs').insert({
        actor: user.name,
        actor_role: user.role,
        action: `Status updated to ${status}`,
        resource: 'REQUEST',
        resource_id: id,
        details: `Request ${id.slice(0, 8)} status changed to ${status}`,
        timestamp: new Date().toISOString(),
        ip_address: '0.0.0.0'
      });
      get().fetchAuditLogs();
    }

    set(state => ({
      requests: state.requests.map(r => r.id === id ? { ...r, status } : r),
    }));
    get().addToast('success', `Request ${status.toLowerCase()}`);
  },

  updatePOStatus: async (id, status) => {
    const user = get().currentUser;
    const { error } = await supabase.from('procurex_purchase_orders')
      .update({ status }).eq('id', id);
    if (error) { get().addToast('error', 'Failed to update PO'); return; }
    
    if (user) {
      await supabase.from('procurex_audit_logs').insert({
        actor: user.name,
        actor_role: user.role,
        action: `Status updated to ${status}`,
        resource: 'PURCHASE_ORDER',
        resource_id: id,
        details: `Purchase Order ${id.slice(0, 8)} status changed to ${status}`,
        timestamp: new Date().toISOString(),
        ip_address: '0.0.0.0'
      });
      get().fetchAuditLogs();
    }

    set(state => ({
      purchaseOrders: state.purchaseOrders.map(po => po.id === id ? { ...po, status } : po),
    }));
    get().addToast('success', `PO marked as ${status.toLowerCase()}`);
  },

  addInventoryItem: async (data) => {
    const now = new Date().toISOString();
    const sku = `SKU-${Date.now().toString().slice(-6)}`;
    const stockLevel = computeStockLevel(data.quantity, data.reorderLevel);
    const { data: row, error } = await supabase.from('procurex_inventory').insert({
      sku,
      name: data.name,
      category: '',
      quantity: data.quantity,
      unit: data.unit,
      reorder_level: data.reorderLevel,
      location: '',
      unit_price: data.unitPrice,
      stock_level: stockLevel,
      last_updated: now,
    }).select('*').single();
    if (error) { get().addToast('error', 'Failed to add inventory item'); throw new Error(error.message); }
    set(state => ({ inventory: [mapInventoryRow(row as Record<string, unknown>), ...state.inventory] }));
    get().addToast('success', 'Inventory item added');
  },

  updateInventoryItem: async (id, data) => {
    const update: Record<string, unknown> = { last_updated: new Date().toISOString() };
    if (data.quantity !== undefined) update.quantity = data.quantity;
    if (data.unitPrice !== undefined) update.unit_price = data.unitPrice;
    if (data.reorderLevel !== undefined) update.reorder_level = data.reorderLevel;
    if (data.name !== undefined) update.name = data.name;
    const current = get().inventory.find(i => i.id === id);
    if (current) {
      const qty = data.quantity ?? current.quantity;
      const reorder = data.reorderLevel ?? current.reorderLevel;
      update.stock_level = computeStockLevel(qty, reorder);
    }
    const { error } = await supabase.from('procurex_inventory').update(update).eq('id', id);
    if (error) { get().addToast('error', 'Failed to update item'); return; }
    set(state => ({
      inventory: state.inventory.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, ...data };
        if (data.quantity !== undefined || data.reorderLevel !== undefined) {
          updated.stockLevel = computeStockLevel(
            data.quantity ?? item.quantity,
            data.reorderLevel ?? item.reorderLevel,
          );
        }
        return updated;
      }),
    }));
    get().addToast('success', 'Inventory updated');
  },

  deleteInventoryItem: async (id) => {
    const { error } = await supabase.from('procurex_inventory').delete().eq('id', id);
    if (error) { get().addToast('error', 'Failed to delete item'); return; }
    set(state => ({ inventory: state.inventory.filter(i => i.id !== id) }));
    get().addToast('success', 'Item deleted');
  },

  addVendor: async (data) => {
    const now = new Date().toISOString();
    const contactPerson = data.contactName || data.contactPerson;
    const { data: row, error } = await supabase.from('procurex_suppliers').insert({
      name: data.name,
      contact_person: contactPerson,
      email: data.email,
      phone: data.phone,
      address: '',
      category: '',
      rating: 0,
      total_orders: 0,
      on_time_rate: 0,
      status: 'active',
      joined_date: now,
    }).select('*').single();
    if (error) { get().addToast('error', 'Failed to add vendor'); throw new Error(error.message); }
    set(state => ({ vendors: [mapVendorRow(row as Record<string, unknown>), ...state.vendors] }));
    get().addToast('success', 'Vendor added');
  },

  updateVendor: async (id, data) => {
    const contactPerson = data.contactName || data.contactPerson;
    const { error } = await supabase.from('procurex_suppliers').update({
      name: data.name,
      contact_person: contactPerson,
      email: data.email,
      phone: data.phone,
    }).eq('id', id);
    if (error) { get().addToast('error', 'Failed to update vendor'); return; }
    set(state => ({
      vendors: state.vendors.map(v => v.id === id ? { ...v, ...data } : v),
    }));
    get().addToast('success', 'Vendor updated');
  },

  markNotificationRead: async (id) => {
    const { error } = await supabase.from('procurex_notifications').update({ read: true }).eq('id', id);
    if (error) return;
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
    }));
  },

  markAllNotificationsRead: async () => {
    const user = get().currentUser;
    if (!user) return;
    const { error } = await supabase.from('procurex_notifications').update({ read: true }).eq('user_id', user.id);
    if (error) return;
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    }));
  },

  addToast: (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set(state => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },

  removeToast: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  dismissToast: (id: string) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  toggleSidebar: () => {
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  toggleMobileNav: () => {
    set(state => ({ mobileNavOpen: !state.mobileNavOpen }));
  },

  closeMobileNav: () => {
    set({ mobileNavOpen: false });
  },
}));
