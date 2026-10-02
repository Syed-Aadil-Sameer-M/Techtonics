export type BackendRole = 'ADMIN' | 'RECEIVER' | 'PROCUREMENT';
export type Role = BackendRole;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: BackendRole;
  department: string;
  username: string;
  userId: string;
  mustChangePassword: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  department: string;
  role: BackendRole;
  status: string;
  avatarColor: string;
  joinedDate: string;
  lastActive: string | null;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export type StockLevel = 'OK' | 'LOW' | 'CRITICAL';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  material: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  minStockLevel: number;
  location: string;
  unitPrice: number;
  price: number;
  stockLevel: StockLevel;
  lastUpdated: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  onTimeRate: number;
  status: string;
  joinedDate: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface MaterialRequest {
  id: string;
  prNumber: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  requestedBy: string;
  department: string;
  status: RequestStatus;
  priority: string;
  items: unknown[];
  material: string;
  quantity: number;
  location: string;
  createdAt: string;
  date: string;
  updatedAt: string;
  neededBy: string;
  totalValue: number;
  assignedOfficerId: string | null;
  poId: string | null;
}

export interface CreateRequestDTO {
  material: string;
  quantity: number;
  location: string;
  description?: string;
  neededBy?: string;
}

export type PurchaseOrderStatus = 'CREATED' | 'SENT' | 'COMPLETED' | 'CANCELLED' | 'RECEIVED';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  prId: string | null;
  prNumber: string | null;
  supplier: string;
  vendor: string;
  supplierId: string;
  items: unknown[];
  status: PurchaseOrderStatus;
  totalValue: number;
  createdAt: string;
  date: string;
  expectedDelivery: string;
  actualDelivery: string | null;
  assignedOfficerId: string;
  trackingNumber: string | null;
  material: string;
  quantity: number;
  notes: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  relatedId: string | null;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  module: string;
  resourceId: string;
  details: string;
  description: string;
  user: string;
  timestamp: string;
  ipAddress: string;
}

export interface Task {
  id: string;
  type: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  relatedId: string;
  relatedType: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
