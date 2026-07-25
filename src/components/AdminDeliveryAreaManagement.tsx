import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { District, PostOffice } from '../types';
import {
  Truck,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  MapPin,
  Building,
  Search,
  DollarSign
} from 'lucide-react';

export const AdminDeliveryAreaManagement: React.FC = () => {
  const {
    districts,
    postOffices,
    siteSettings,
    updateSiteSettingsState,
    fetchDistricts,
    fetchPostOffices,
    showToast
  } = useApp();

  // Active Subtab
  const [subTab, setSubTab] = useState<'charges' | 'districts' | 'post-offices'>('charges');

  // Delivery Charges Form
  const [insideDhakaCharge, setInsideDhakaCharge] = useState(siteSettings.deliveryChargeInsideDhaka);
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState(siteSettings.deliveryChargeOutsideDhaka);
  const [savingCharges, setSavingCharges] = useState(false);

  // Search Filters
  const [districtSearch, setDistrictSearch] = useState('');
  const [postOfficeSearch, setPostOfficeSearch] = useState('');

  // District Modal / Form State
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [editingDistrictId, setEditingDistrictId] = useState<number | null>(null);
  const [districtForm, setDistrictForm] = useState({
    name: '',
    nameBn: '',
    division: 'Dhaka',
    isInsideDhaka: false,
    deliveryCharge: '',
    isEnabled: true
  });

  // Post Office Modal / Form State
  const [showPostOfficeModal, setShowPostOfficeModal] = useState(false);
  const [editingPostOfficeId, setEditingPostOfficeId] = useState<number | null>(null);
  const [postOfficeForm, setPostOfficeForm] = useState({
    districtName: 'Dhaka',
    postOfficeName: '',
    postOfficeNameBn: '',
    postCode: '',
    isEnabled: true
  });

  // SAVE DELIVERY CHARGES TO SETTINGS
  const handleSaveDeliveryCharges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCharges(true);
    try {
      const updatedSettings = {
        ...siteSettings,
        deliveryChargeInsideDhaka: Number(insideDhakaCharge),
        deliveryChargeOutsideDhaka: Number(outsideDhakaCharge)
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });

      if (res.ok) {
        updateSiteSettingsState(updatedSettings);
        showToast('ডেলিভারি চার্জ সফলভাবে সেভ করা হয়েছে!', 'success');
      } else {
        showToast('ডেলিভারি চার্জ সেভ করা যায়নি', 'error');
      }
    } catch (err) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setSavingCharges(false);
    }
  };

  // DISTRICT CRUD
  const handleOpenAddDistrict = () => {
    setEditingDistrictId(null);
    setDistrictForm({
      name: '',
      nameBn: '',
      division: 'Dhaka',
      isInsideDhaka: false,
      deliveryCharge: '',
      isEnabled: true
    });
    setShowDistrictModal(true);
  };

  const handleOpenEditDistrict = (d: District) => {
    setEditingDistrictId(d.id);
    setDistrictForm({
      name: d.name,
      nameBn: d.nameBn,
      division: d.division || 'Dhaka',
      isInsideDhaka: d.isInsideDhaka,
      deliveryCharge: d.deliveryCharge ? String(d.deliveryCharge) : '',
      isEnabled: d.isEnabled
    });
    setShowDistrictModal(true);
  };

  const handleSaveDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingDistrictId ? 'PUT' : 'POST';
      const url = editingDistrictId ? `/api/districts/${editingDistrictId}` : '/api/districts';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(districtForm)
      });

      if (res.ok) {
        showToast(`জেলা ${editingDistrictId ? 'আপডেট' : 'যোগ'} সম্পন্ন হয়েছে!`, 'success');
        setShowDistrictModal(false);
        fetchDistricts();
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast('সার্ভার ত্রুটি', 'error');
    }
  };

  const handleDeleteDistrict = async (id: number) => {
    if (!confirm('আপনি কি এই জেলাটি ডিলিট করতে চান?')) return;
    try {
      const res = await fetch(`/api/districts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('জেলা মুছে ফেলা হয়েছে', 'info');
        fetchDistricts();
      }
    } catch (err) {
      showToast('ডিলিট করা যায়নি', 'error');
    }
  };

  // POST OFFICE CRUD
  const handleOpenAddPostOffice = () => {
    setEditingPostOfficeId(null);
    setPostOfficeForm({
      districtName: districts[0]?.name || 'Dhaka',
      postOfficeName: '',
      postOfficeNameBn: '',
      postCode: '',
      isEnabled: true
    });
    setShowPostOfficeModal(true);
  };

  const handleOpenEditPostOffice = (po: PostOffice) => {
    setEditingPostOfficeId(po.id);
    setPostOfficeForm({
      districtName: po.districtName,
      postOfficeName: po.postOfficeName,
      postOfficeNameBn: po.postOfficeNameBn,
      postCode: po.postCode,
      isEnabled: po.isEnabled
    });
    setShowPostOfficeModal(true);
  };

  const handleSavePostOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingPostOfficeId ? 'PUT' : 'POST';
      const url = editingPostOfficeId ? `/api/post-offices/${editingPostOfficeId}` : '/api/post-offices';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postOfficeForm)
      });

      if (res.ok) {
        showToast(`পোস্ট অফিস ${editingPostOfficeId ? 'আপডেট' : 'যোগ'} সম্পন্ন হয়েছে!`, 'success');
        setShowPostOfficeModal(false);
        fetchPostOffices();
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast('সার্ভার ত্রুটি', 'error');
    }
  };

  const handleDeletePostOffice = async (id: number) => {
    if (!confirm('আপনি কি এই পোস্ট অফিসটি ডিলিট করতে চান?')) return;
    try {
      const res = await fetch(`/api/post-offices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('পোস্ট অফিস মুছে ফেলা হয়েছে', 'info');
        fetchPostOffices();
      }
    } catch (err) {
      showToast('ডিলিট করা যায়নি', 'error');
    }
  };

  // Filtered Lists
  const filteredDistricts = districts.filter(
    d =>
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.nameBn.includes(districtSearch) ||
      (d.division && d.division.toLowerCase().includes(districtSearch.toLowerCase()))
  );

  const filteredPostOffices = postOffices.filter(
    po =>
      po.districtName.toLowerCase().includes(postOfficeSearch.toLowerCase()) ||
      po.postOfficeName.toLowerCase().includes(postOfficeSearch.toLowerCase()) ||
      po.postOfficeNameBn.includes(postOfficeSearch) ||
      po.postCode.includes(postOfficeSearch)
  );

  return (
    <div className="space-y-6 font-hind">
      {/* Top Title Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#0A66C2]" />
            <span>ডেলিভারি এরিয়া ও জেলা/পোস্ট অফিস ম্যানেজমেন্ট (Delivery Areas)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            বাংলাদেশের ৬৪ জেলা, নির্দিষ্ট ডেলিভারি চার্জ ও পোস্ট কোডসমূহ পরিচালনা করুন।
          </p>
        </div>

        {/* Subtab Switches */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setSubTab('charges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === 'charges' ? 'bg-[#0A66C2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            ডেলিভারি চার্জ
          </button>
          <button
            onClick={() => setSubTab('districts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === 'districts' ? 'bg-[#0A66C2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            জেলাসমূহ ({districts.length})
          </button>
          <button
            onClick={() => setSubTab('post-offices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === 'post-offices' ? 'bg-[#0A66C2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            পোস্ট অফিস ও কোড ({postOffices.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DELIVERY CHARGES */}
      {subTab === 'charges' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs max-w-2xl space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b pb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>মূল ডেলিভারি চার্জ নির্ধারণ (Default Delivery Charges)</span>
          </h3>

          <form onSubmit={handleSaveDeliveryCharges} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঢাকার ভেতরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  required
                  value={insideDhakaCharge}
                  onChange={e => setInsideDhakaCharge(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-bold font-poppins text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঢাকার বাইরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  required
                  value={outsideDhakaCharge}
                  onChange={e => setOutsideDhakaCharge(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-bold font-poppins text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingCharges}
              className="flex items-center gap-2 bg-[#2EBD59] hover:bg-[#24a24a] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingCharges ? 'সংরক্ষণ হচ্ছে...' : 'ডেলিভারি চার্জ আপডেট করুন'}</span>
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 2: DISTRICTS MANAGEMENT */}
      {subTab === 'districts' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={districtSearch}
                onChange={e => setDistrictSearch(e.target.value)}
                placeholder="জেলা দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium"
              />
            </div>

            <button
              onClick={handleOpenAddDistrict}
              className="flex items-center gap-2 bg-[#0A66C2] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন জেলা যোগ করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">জেলার নাম (English)</th>
                  <th className="p-3">বাংলা নাম</th>
                  <th className="p-3">বিভাগ</th>
                  <th className="p-3">ঢাকার ভেতরে?</th>
                  <th className="p-3">কাস্টম চার্জ</th>
                  <th className="p-3">অবস্থা</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredDistricts.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{d.name}</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{d.nameBn}</td>
                    <td className="p-3 text-slate-500">{d.division || '-'}</td>
                    <td className="p-3">
                      {d.isInsideDhaka ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">ঢাকার ভেতরে</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">ঢাকার বাইরে</span>
                      )}
                    </td>
                    <td className="p-3 font-poppins font-bold">
                      {d.deliveryCharge ? `৳${d.deliveryCharge}` : 'ডিফল্ট'}
                    </td>
                    <td className="p-3">
                      {d.isEnabled ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> সক্রিয়
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> নিষ্ক্রিয়
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditDistrict(d)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDistrict(d.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: POST OFFICES MANAGEMENT */}
      {subTab === 'post-offices' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={postOfficeSearch}
                onChange={e => setPostOfficeSearch(e.target.value)}
                placeholder="পোস্ট অফিস / পোস্ট কোড দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium"
              />
            </div>

            <button
              onClick={handleOpenAddPostOffice}
              className="flex items-center gap-2 bg-[#0A66C2] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পোস্ট অফিস যোগ করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">জেলা</th>
                  <th className="p-3">পোস্ট অফিস (English)</th>
                  <th className="p-3">বাংলা নাম</th>
                  <th className="p-3">পোস্ট কোড</th>
                  <th className="p-3">অবস্থা</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredPostOffices.map((po, idx) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-blue-600">{po.districtName}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{po.postOfficeName}</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{po.postOfficeNameBn}</td>
                    <td className="p-3 font-poppins font-black text-amber-600">{po.postCode}</td>
                    <td className="p-3">
                      {po.isEnabled ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> সক্রিয়
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> নিষ্ক্রিয়
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditPostOffice(po)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePostOffice(po.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISTRICT MODAL */}
      {showDistrictModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingDistrictId ? 'জেলা তথ্য এডিট করুন' : 'নতুন জেলা যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveDistrict} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">District Name (English)</label>
                <input
                  type="text"
                  required
                  value={districtForm.name}
                  onChange={e => setDistrictForm({ ...districtForm, name: e.target.value })}
                  placeholder="e.g. Gazipur"
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">জেলার নাম (বাংলা)</label>
                <input
                  type="text"
                  required
                  value={districtForm.nameBn}
                  onChange={e => setDistrictForm({ ...districtForm, nameBn: e.target.value })}
                  placeholder="যেমনঃ গাজীপুর"
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বিভাগ (Division)</label>
                <select
                  value={districtForm.division}
                  onChange={e => setDistrictForm({ ...districtForm, division: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inside-dhaka-check"
                  checked={districtForm.isInsideDhaka}
                  onChange={e => setDistrictForm({ ...districtForm, isInsideDhaka: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="inside-dhaka-check" className="font-bold cursor-pointer">
                  ঢাকার ভেতরে ডেলিভারি এলাকায় অন্তর্ভুক্ত?
                </label>
              </div>

              <div>
                <label className="block font-bold mb-1">কাস্টম ডেলিভারি চার্জ (ফাঁকা রাখলে ডিফল্ট কাজ করবে)</label>
                <input
                  type="number"
                  value={districtForm.deliveryCharge}
                  onChange={e => setDistrictForm({ ...districtForm, deliveryCharge: e.target.value })}
                  placeholder="e.g. 80"
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowDistrictModal(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A66C2] text-white font-bold"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST OFFICE MODAL */}
      {showPostOfficeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingPostOfficeId ? 'পোস্ট অফিস এডিট করুন' : 'নতুন পোস্ট অফিস যোগ করুন'}
            </h3>

            <form onSubmit={handleSavePostOffice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">জেলা নির্বাচন করুন</label>
                <select
                  value={postOfficeForm.districtName}
                  onChange={e => setPostOfficeForm({ ...postOfficeForm, districtName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 font-bold"
                >
                  {districts.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.nameBn} ({d.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Post Office Name (English)</label>
                <input
                  type="text"
                  required
                  value={postOfficeForm.postOfficeName}
                  onChange={e => setPostOfficeForm({ ...postOfficeForm, postOfficeName: e.target.value })}
                  placeholder="e.g. Dhanmandi"
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">পোস্ট অফিসের নাম (বাংলা)</label>
                <input
                  type="text"
                  required
                  value={postOfficeForm.postOfficeNameBn}
                  onChange={e => setPostOfficeForm({ ...postOfficeForm, postOfficeNameBn: e.target.value })}
                  placeholder="যেমনঃ ধানমন্ডি"
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">পোস্ট কোড (4-Digit Post Code)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postOfficeForm.postCode}
                  onChange={e => setPostOfficeForm({ ...postOfficeForm, postCode: e.target.value })}
                  placeholder="যেমনঃ 1205"
                  className="w-full px-3 py-2 rounded-xl border font-poppins font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostOfficeModal(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A66C2] text-white font-bold"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
