import React, { useState } from 'react';
import { Order } from '../types';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  CheckCheck,
  XCircle,
  RotateCcw,
  Search,
  Calendar,
  Phone,
  MapPin,
  FileText,
  User,
  ShoppingBag
} from 'lucide-react';

interface AdminOrderManagementProps {
  orders: Order[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

type OrderTabFilter =
  | 'All'
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export const AdminOrderManagement: React.FC<AdminOrderManagementProps> = ({
  orders,
  onRefresh,
  showToast
}) => {
  const [activeTabFilter, setActiveTabFilter] = useState<OrderTabFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Status counts
  const counts = {
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Confirmed: orders.filter(o => o.status === 'Confirmed').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Packed: orders.filter(o => o.status === 'Packed').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
    Returned: orders.filter(o => o.status === 'Returned').length
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTabFilter === 'All' ? true : o.status === activeTabFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle Confirm Order Button
  const handleConfirmOrder = async (orderId: string) => {
    setConfirmingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'POST'
      });
      if (res.ok) {
        showToast('Order has been confirmed successfully.', 'success');
        onRefresh();
      } else {
        showToast('অর্ডার কনফার্ম করতে সমস্যা হয়েছে', 'error');
      }
    } catch (err) {
      showToast('সার্ভার কানেকশন ত্রুটি', 'error');
    } finally {
      setConfirmingId(null);
    }
  };

  // Handle Status Update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`অর্ডার #${orderId} স্টেটাস ${newStatus} তে আপডেট হয়েছে`, 'success');
        onRefresh();
      } else {
        showToast('স্টেটাস পরিবর্তন ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast('নেটওয়ার্ক ত্রুটি', 'error');
    }
  };

  // Status Badge Component
  const renderStatusBadge = (status: string, confirmedAt?: any) => {
    switch (status) {
      case 'Confirmed':
        return (
          <div className="flex flex-col items-start sm:items-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed</span>
            </span>
            {confirmedAt && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-poppins mt-1">
                কনফার্ম সময়: {new Date(confirmedAt).toLocaleString()}
              </span>
            )}
          </div>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Order</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-[#0A66C2] dark:text-blue-300">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Packed</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'Returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Returned</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-hind">
      {/* Header & Metrics */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-[#0A66C2]" />
              <span>অর্ডার ম্যানেজমেন্ট সিস্টেম (Order Management)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              সকল কাস্টমার অর্ডার প্রসেসিং, স্টেটাস পরিবর্তন ও কনফার্মেশন পরিচালনা করুন।
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="অর্ডার ID / গ্রাহকের নাম / ফোন..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium"
            />
          </div>
        </div>

        {/* Status Workflow Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(
            [
              { id: 'All', label: 'সব অর্ডার', count: counts.All, color: 'bg-slate-800 text-white' },
              { id: 'Pending', label: 'পেন্ডিং', count: counts.Pending, color: 'bg-amber-600 text-white' },
              { id: 'Confirmed', label: 'কনফার্মড', count: counts.Confirmed, color: 'bg-emerald-600 text-white' },
              { id: 'Processing', label: 'প্রসেসিং', count: counts.Processing, color: 'bg-blue-600 text-white' },
              { id: 'Packed', label: 'প্যাকড', count: counts.Packed, color: 'bg-indigo-600 text-white' },
              { id: 'Shipped', label: 'শিপড', count: counts.Shipped, color: 'bg-sky-600 text-white' },
              { id: 'Delivered', label: 'ডেলিভার্ড', count: counts.Delivered, color: 'bg-teal-600 text-white' },
              { id: 'Cancelled', label: 'ক্যান্সেলড', count: counts.Cancelled, color: 'bg-rose-600 text-white' },
              { id: 'Returned', label: 'ریٹر্নড', count: counts.Returned, color: 'bg-slate-600 text-white' }
            ] as const
          ).map(tab => {
            const isActive = activeTabFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabFilter(tab.id as OrderTabFilter)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition ${
                  isActive
                    ? `${tab.color} shadow-sm ring-2 ring-offset-1 ring-slate-400`
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-poppins ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              কোনো অর্ডার পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-400">
              নির্বাচিত ফিল্টারে কোনো কাস্টমার অর্ডার নিবন্ধিত নেই।
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className={`p-6 rounded-3xl border shadow-xs transition space-y-4 bg-white dark:bg-slate-800 ${
                order.status === 'Confirmed'
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Order Header & Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins text-base">
                      Order #{order.id}
                    </span>
                    {renderStatusBadge(order.status, order.confirmedAt)}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-poppins">{new Date(order.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Confirm Order Button for Pending Orders */}
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleConfirmOrder(order.id)}
                      disabled={confirmingId === order.id}
                      className="flex items-center gap-1.5 bg-[#2EBD59] hover:bg-[#24a24a] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95 animate-pulse"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{confirmingId === order.id ? 'কনফার্ম হচ্ছে...' : 'Confirm Order'}</span>
                    </button>
                  )}

                  {/* Status Change Selector */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500">স্টেটাস পরিবর্তন:</span>
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-900 dark:text-white border-0 focus:ring-0 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                
                {/* Customer Details */}
                <div className="md:col-span-6 space-y-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs text-[#0A66C2]">
                    <User className="w-4 h-4" />
                    <span>গ্রাহকের ঠিকানা ও ডেলিভারি তথ্য</span>
                  </h4>

                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p><strong className="text-slate-900 dark:text-white">নাম:</strong> {order.customerName}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <strong>ফোন:</strong> <span className="font-poppins font-bold text-slate-900 dark:text-white">{order.phone}</span>
                    </p>
                    {order.email && <p><strong>ইমেইল:</strong> {order.email}</p>}
                    
                    <div className="pt-1 space-y-1">
                      <p><strong className="text-slate-900 dark:text-white">জেলা:</strong> <span className="font-bold text-blue-600">{order.district}</span></p>
                      {order.thana && <p><strong>উপজেলা/থানা:</strong> {order.thana}</p>}
                      {order.postOffice && (
                        <p>
                          <strong>পোস্ট অফিস:</strong> {order.postOffice} {order.postCode ? `(কোড: ${order.postCode})` : ''}
                        </p>
                      )}
                      {order.villageRoad && <p><strong>গ্রাম/রোড/বাসা:</strong> {order.villageRoad}</p>}
                      <p className="flex items-start gap-1 text-slate-800 dark:text-slate-200 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>পূর্ণ ঠিকানা:</strong> {order.address}</span>
                      </p>
                    </div>

                    {order.deliveryNote && (
                      <div className="mt-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>নোট:</strong> {order.deliveryNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchased Products List */}
                <div className="md:col-span-6 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs text-[#2EBD59] mb-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>অর্ডারকৃত পণ্যসমূহ</span>
                    </h4>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            {item.productImage && (
                              <img src={item.productImage} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover" />
                            )}
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                              <p className="text-[11px] text-slate-400">পরিমাণ: {item.quantity} টি</p>
                            </div>
                          </div>
                          <span className="font-bold font-poppins text-slate-900 dark:text-white">
                            ৳{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1 text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between text-[11px]">
                      <span>সাবটোটাল: ৳{order.subtotal}</span>
                      <span>ডেলিভারি: ৳{order.deliveryCharge}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white pt-1">
                      <span>পেমেন্ট: <span className="uppercase text-emerald-600 font-poppins">{order.paymentMethod}</span></span>
                      <span className="text-xl font-poppins text-[#0A66C2]">৳{order.total}</span>
                    </div>

                    {order.transactionId && (
                      <p className="text-[11px] text-right text-amber-600 font-poppins font-bold">
                        TrxID: {order.transactionId}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
