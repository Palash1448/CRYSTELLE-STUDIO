import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Thermometer,
  Droplets,
  Wind,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Beaker,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkshopBatch } from '@/lib/admin-data';

interface AdminWorkshopProps {
  batches: WorkshopBatch[];
  onAddBatch: (batch: WorkshopBatch) => void;
}

export function AdminWorkshop({ batches, onAddBatch }: AdminWorkshopProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [candleName, setCandleName] = useState('Lavender Bliss');
  const [quantity, setQuantity] = useState(40);
  const [waxType, setWaxType] = useState<'100% Pure Soy Wax' | 'Botanical Beeswax Blend'>(
    '100% Pure Soy Wax'
  );

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: WorkshopBatch = {
      id: `batch-${Date.now()}`,
      batchCode: `BATCH #2026-B${Math.floor(45 + Math.random() * 20)}`,
      candleName,
      fragrance: 'Artisan Custom Infusion',
      quantity,
      waxType,
      status: 'Pre-Wicking',
      progress: 10,
      pouredAt: 'Scheduled for this afternoon',
      cureReadyAt: 'In 3 days',
    };
    onAddBatch(newBatch);
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Ready For Customization Callout Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-[#1A1816] to-[#141311] border border-purple-500/30 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-[#EDE8E1]">
                Artisan Candle Workshop & Lab Active
              </h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                Customizable
              </span>
            </div>
            <p className="text-[11px] text-[#9E978E] mt-0.5">
              Monitor soy wax curing rooms, formulation batches, fragrance blend ratios, and climate sensors. Later, we can add batch barcode tracking or fragrance formulation logs!
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowScheduleModal(true)}
          className="bg-[#D4A359] hover:bg-[#E0B26D] text-[#121110] font-semibold text-xs h-9 px-4 flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Batch Pour
        </Button>
      </div>

      {/* Workshop Climate Sensors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141311] border border-[#262320] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9E978E]">Curing Room Ambient</span>
            <p className="text-xl font-mono font-semibold text-[#EDE8E1] mt-1">22.4°C</p>
            <span className="text-[10px] text-emerald-400 font-medium">Ideal for Smooth Soy Tops</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Thermometer className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141311] border border-[#262320] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9E978E]">Relative Humidity</span>
            <p className="text-xl font-mono font-semibold text-[#EDE8E1] mt-1">44%</p>
            <span className="text-[10px] text-emerald-400 font-medium">Optimal (40% - 50% target)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141311] border border-[#262320] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9E978E]">Ventilation & Airflow</span>
            <p className="text-xl font-mono font-semibold text-[#EDE8E1] mt-1">1.2 m/s</p>
            <span className="text-[10px] text-emerald-400 font-medium">Zero-Draft Stabilization</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Wind className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Production Batches List */}
      <div className="rounded-xl bg-[#141311] border border-[#262320] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#262320] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-[#D4A359]" />
            <span className="text-xs font-semibold text-[#EDE8E1]">
              Live Batch Curing & Pouring Queue ({batches.length} Batches)
            </span>
          </div>
          <span className="text-[11px] text-[#8C847B]">Slow-cure artisan cycle (48h minimum)</span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="p-5 rounded-xl bg-[#181614] border border-[#262320] hover:border-[#D4A359]/40 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#D4A359]">
                  {batch.batchCode}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#201D1A] text-[#C8C2BA] border border-[#2E2A27]">
                  {batch.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#FAF7F2]">{batch.candleName}</h4>
                <p className="text-xs text-[#9E978E] mt-0.5">{batch.fragrance}</p>
                <p className="text-[11px] text-[#8C847B] mt-1">
                  Volume: <strong className="text-[#EDE8E1]">{batch.quantity} Jars</strong> •{' '}
                  {batch.waxType}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8C847B]">Cure Cycle</span>
                  <span className="font-mono text-[#FAF7F2] font-semibold">{batch.progress}%</span>
                </div>
                <div className="w-full bg-[#221F1C] h-2 rounded-full overflow-hidden border border-[#2B2724]">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${batch.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#262320] flex items-center justify-between text-[11px] text-[#8C847B]">
                <span>Poured: {batch.pouredAt}</span>
                <span className="text-emerald-400">{batch.cureReadyAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Materials Inventory */}
      <div className="p-6 rounded-xl bg-[#141311] border border-[#262320] space-y-4">
        <h3 className="text-xs font-semibold text-[#EDE8E1] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4A359]" />
          Raw Botanical Ingredients & Supplies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-[#181614] border border-[#262320]">
            <span className="text-[11px] text-[#8C847B]">Pure Soy Wax Flakes</span>
            <p className="text-base font-semibold text-[#FAF7F2] font-mono mt-1">45.0 kg</p>
            <span className="text-[10px] text-emerald-400">Stock Normal (90 batches)</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#181614] border border-[#262320]">
            <span className="text-[11px] text-[#8C847B]">Pure Botanical Oils</span>
            <p className="text-base font-semibold text-[#FAF7F2] font-mono mt-1">12.5 Liters</p>
            <span className="text-[10px] text-emerald-400">French Lavender & Amber</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#181614] border border-[#262320]">
            <span className="text-[11px] text-[#8C847B]">Cotton Core Wicks</span>
            <p className="text-base font-semibold text-[#FAF7F2] font-mono mt-1">650 Units</p>
            <span className="text-[10px] text-emerald-400">Pre-waxed braided wicks</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#181614] border border-[#262320]">
            <span className="text-[11px] text-[#8C847B]">Amber & Pearl Vessels</span>
            <p className="text-base font-semibold text-[#FAF7F2] font-mono mt-1">180 Units</p>
            <span className="text-[10px] text-amber-400">Restock recommended</span>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#141311] border border-[#2B2724] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-semibold text-[#EDE8E1]">Schedule Workshop Batch Pour</h3>
            <form onSubmit={handleSchedule} className="space-y-4 text-xs">
              <div>
                <label className="text-[#9E978E] block mb-1">Candle Formulation</label>
                <select
                  value={candleName}
                  onChange={(e) => setCandleName(e.target.value)}
                  className="w-full h-9 rounded-md bg-[#1C1A17] border border-[#2E2A27] px-3 text-xs text-[#EDE8E1]"
                >
                  <option value="Lavender Bliss">Lavender Bliss</option>
                  <option value="Sandalwood Serenity">Sandalwood Serenity</option>
                  <option value="Vanilla Dream">Vanilla Dream</option>
                  <option value="Rose Petal Botanical">Rose Petal Botanical</option>
                  <option value="Citrus Fresh">Citrus Fresh</option>
                </select>
              </div>

              <div>
                <label className="text-[#9E978E] block mb-1">Batch Size (Vessels)</label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-9 rounded-md bg-[#1C1A17] border border-[#2E2A27] px-3 text-xs text-[#EDE8E1]"
                />
              </div>

              <div>
                <label className="text-[#9E978E] block mb-1">Wax Formulation</label>
                <select
                  value={waxType}
                  onChange={(e) => setWaxType(e.target.value as any)}
                  className="w-full h-9 rounded-md bg-[#1C1A17] border border-[#2E2A27] px-3 text-xs text-[#EDE8E1]"
                >
                  <option value="100% Pure Soy Wax">100% Pure Soy Wax</option>
                  <option value="Botanical Beeswax Blend">Botanical Beeswax Blend</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowScheduleModal(false)}
                  className="text-xs text-[#9E978E]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#D4A359] hover:bg-[#E0B26D] text-[#121110] font-semibold text-xs"
                >
                  Confirm Batch Pour
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
