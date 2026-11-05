import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  PlusCircle,
  Package,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Truck,
  Shield,
  Info,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import type { Donation, DonationItem, ResourceCategory } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/donor/dashboard', icon: <Heart size={18} /> },
  { label: 'Make a Contribution', to: '/donor/donate', icon: <PlusCircle size={18} /> },
  { label: 'Donation History', to: '/donor/donations', icon: <Clock size={18} /> },
];

export default function MakeDonation() {
  const { currentUser } = useAuth();
  const { dispatch } = useAppState();
  const navigate = useNavigate();

  const [donationType, setDonationType] = useState<'monetary' | 'material'>('monetary');
  const [submittedDonation, setSubmittedDonation] = useState<Donation | null>(null);

  // Monetary Fields
  const [amount, setAmount] = useState<number>(25000);
  const [currency] = useState('INR');
  const [monetaryZone, setMonetaryZone] = useState('Kalyan Nagar');
  const [monetaryCategory, setMonetaryCategory] = useState<ResourceCategory>('food');
  const [monetaryMsg, setMonetaryMsg] = useState('');

  // Material Fields
  const [materialCategory, setMaterialCategory] = useState<ResourceCategory>('water');
  const [itemName, setItemName] = useState('Bottled Water 1L');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState('bottles');
  const [condition, setCondition] = useState<'new' | 'good' | 'fair'>('new');
  const [pickupDropoff, setPickupDropoff] = useState<'pickup' | 'dropoff'>('dropoff');
  const [location, setLocation] = useState('Central Warehouse – Thane');
  const [materialZone, setMaterialZone] = useState('Kalyan Nagar');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donationId = `DON-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    let newDonation: Donation;

    if (donationType === 'monetary') {
      newDonation = {
        id: donationId,
        donorId: currentUser?.id || 'D001',
        donorName: currentUser?.name || 'Helping Hand Partner',
        type: 'monetary',
        status: 'allocated',
        submittedAt: now,
        updatedAt: now,
        amount,
        currency,
        preferredZone: monetaryZone,
        preferredCategory: monetaryCategory,
        message: monetaryMsg,
        transactionRef: `TXN-DEMO-${Date.now().toString().slice(-8)}`,
      };
    } else {
      const item: DonationItem = {
        id: `DI-${Date.now()}`,
        name: itemName,
        category: materialCategory,
        quantity,
        unit,
        condition,
        pickupDropoff,
        location,
        inspectionStatus: 'pending',
      };

      newDonation = {
        id: donationId,
        donorId: currentUser?.id || 'D001',
        donorName: currentUser?.name || 'Helping Hand Partner',
        type: 'material',
        status: 'received',
        submittedAt: now,
        updatedAt: now,
        preferredZone: materialZone,
        preferredCategory: materialCategory,
        items: [item],
      };
    }

    dispatch({ type: 'ADD_DONATION', payload: newDonation });
    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: 'Donation Pledged',
        actorId: currentUser?.id || 'D001',
        actorName: currentUser?.name || 'Helping Hand Partner',
        actorRole: 'donor',
        timestamp: now,
        details: `Donation ${donationId} registered (${donationType}). Designated: ${newDonation.preferredZone}`,
        entityId: donationId,
        entityType: 'donation',
      },
    });

    setSubmittedDonation(newDonation);
  };

  if (submittedDonation) {
    return (
      <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Donor Portal" portalColor="#E5A04B">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 text-teal rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={36} />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#172D40]">
              Donation Pledged & Registered
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Thank you for contributing to community resilience. Your contribution is logged in the public ledger.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Tracking ID:</span>
              <span className="font-mono font-bold text-[#172D40]">{submittedDonation.id}</span>
            </div>
            {submittedDonation.type === 'monetary' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Amount:</span>
                  <span className="font-bold text-teal">₹{submittedDonation.amount?.toLocaleString()} (Simulated)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Txn Reference:</span>
                  <span className="font-mono text-gray-700">{submittedDonation.transactionRef}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Material Item:</span>
                  <span className="font-bold text-gray-800">{submittedDonation.items?.[0]?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Quantity:</span>
                  <span className="font-bold text-teal">{submittedDonation.items?.[0]?.quantity} {submittedDonation.items?.[0]?.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Logistics Method:</span>
                  <span className="capitalize">{submittedDonation.items?.[0]?.pickupDropoff}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Designated Zone:</span>
              <span className="font-medium text-gray-800">{submittedDonation.preferredZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Lifecycle Status:</span>
              <span className="font-bold uppercase text-teal">{submittedDonation.status.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/donor/donations')}
              className="btn-primary"
            >
              View Donation Timeline
            </button>
            <button
              onClick={() => {
                setSubmittedDonation(null);
              }}
              className="btn-secondary"
            >
              Make Another Donation
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Donor Portal" portalColor="#E5A04B">
      <div className="max-w-3xl mx-auto space-y-6">
        <DemoBanner message="SIMULATED DONATION FLOW: No real credit card or bank account is billed. Monetary funds and material inventory are simulated for disaster relief training." />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Make a Relief Contribution</h1>
            <p className="text-sm text-gray-500 mt-1">
              Provide simulated monetary funds or register physical relief supplies for warehouse reception.
            </p>
          </div>

          {/* Type Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setDonationType('monetary')}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                donationType === 'monetary'
                  ? 'border-teal bg-teal/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-3 bg-teal/10 rounded-lg text-teal">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#172D40]">Monetary Contribution</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Fund bulk procurement of drinking water, rations, medicines, and rescue boats.
                </p>
              </div>
            </div>

            <div
              onClick={() => setDonationType('material')}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                donationType === 'material'
                  ? 'border-amber bg-amber/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-3 bg-amber/10 rounded-lg text-amber">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#172D40]">Material Contribution</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Donate packaged bottled water, dry ration food, hygiene kits, blankets, or tents.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t">
            {donationType === 'monetary' ? (
              /* MONETARY FORM */
              <div className="space-y-5">
                <div>
                  <label className="label">Contribution Amount (INR) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="input-field pl-8 font-heading font-bold text-lg text-teal"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[5000, 10000, 25000, 50000, 100000].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setAmount(preset)}
                        className="text-xs py-1 px-2.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium"
                      >
                        ₹{preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Preferred Disaster Zone</label>
                    <select
                      value={monetaryZone}
                      onChange={(e) => setMonetaryZone(e.target.value)}
                      className="input-field text-xs"
                    >
                      <option value="Kalyan Nagar">Kalyan Nagar (Flood Severity: High)</option>
                      <option value="Bhiwandi">Bhiwandi Lowlands</option>
                      <option value="Thane West">Thane Urban Perimeter</option>
                      <option value="General Disaster Reserve">Authority Discretion (Highest Need)</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Target Resource Category</label>
                    <select
                      value={monetaryCategory}
                      onChange={(e) => setMonetaryCategory(e.target.value as ResourceCategory)}
                      className="input-field text-xs"
                    >
                      <option value="food">Emergency Food & Nutrition</option>
                      <option value="water">Clean Drinking Water</option>
                      <option value="medical">First Aid & Medical Supplies</option>
                      <option value="shelter">Emergency Tents & Bedding</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Message / Note of Support (Optional)</label>
                  <textarea
                    rows={2}
                    value={monetaryMsg}
                    onChange={(e) => setMonetaryMsg(e.target.value)}
                    placeholder="Wishing safety and strength to affected communities..."
                    className="input-field text-xs"
                  />
                </div>

                <div className="bg-amber/10 border border-amber/30 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                  <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Demonstration Simulator:</strong> Clicking "Authorize Contribution" will generate a simulated digital transaction record without processing real financial payment.
                  </span>
                </div>
              </div>
            ) : (
              /* MATERIAL FORM */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Resource Category *</label>
                    <select
                      value={materialCategory}
                      onChange={(e) => setMaterialCategory(e.target.value as ResourceCategory)}
                      className="input-field text-xs"
                    >
                      <option value="water">Drinking Water</option>
                      <option value="food">Ready-to-eat / Dry Ration</option>
                      <option value="shelter">Blankets & Tents</option>
                      <option value="clothing_essentials">Hygiene Kits & Clothing</option>
                      <option value="medical">Medical First Aid Kits</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Item Specification *</label>
                    <input
                      type="text"
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g. Sealed Mineral Water Bottles"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="label">Packaging Unit *</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. bottles, kits, boxes"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="label">Item Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="input-field text-xs"
                    >
                      <option value="new">Brand New / Factory Sealed</option>
                      <option value="good">Gently Used / Good</option>
                      <option value="fair">Acceptable</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Logistics Preference</label>
                    <div className="flex gap-4 pt-1">
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="logistics"
                          checked={pickupDropoff === 'dropoff'}
                          onChange={() => setPickupDropoff('dropoff')}
                        />
                        <span>Self Drop-off at Warehouse</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="logistics"
                          checked={pickupDropoff === 'pickup'}
                          onChange={() => setPickupDropoff('pickup')}
                        />
                        <span>Request Volunteer Pickup</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="label">Designated Disaster Area</label>
                    <select
                      value={materialZone}
                      onChange={(e) => setMaterialZone(e.target.value)}
                      className="input-field text-xs"
                    >
                      <option value="Kalyan Nagar">Kalyan Nagar</option>
                      <option value="Bhiwandi">Bhiwandi</option>
                      <option value="Thane">Thane Central</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Delivery / Warehouse Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                  <strong>Notice:</strong> Physical materials will be registered with status <em>Received</em>. They will not be counted as usable inventory until inspected and accepted by municipal health coordinators.
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
              >
                <CheckCircle size={16} /> Authorize & Register Contribution
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
