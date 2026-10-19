import { useState } from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { BrainWatermark } from './BrainIllustrations';
import type { PredictionResultData } from './PredictionPage';

interface XaiPageProps {
  prediction: PredictionResultData | null;
  originalImageBase64?: string;
  onUploadRedirect: () => void;
}

export const XaiPage: React.FC<XaiPageProps> = ({
  prediction,
  originalImageBase64,
  onUploadRedirect
}) => {
  const [activeTab, setActiveTab] = useState<'GRADCAM' | 'SHAP' | 'LIME'>('GRADCAM');

  const branches = prediction?.gradcam_images_base64 
    ? Object.keys(prediction.gradcam_images_base64) 
    : [];
  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0] || 'vgg16');

  if (!prediction) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">Explainable AI Results</h1>
            <p className="text-xs sm:text-sm text-[#5a7191] mt-0.5">
              Visual explanations showing which regions influenced the prediction.
            </p>
          </div>
          <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
        </div>

        <div className="bg-white rounded-2xl border border-[#dbe6f5] p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2445]">No XAI Results Available</h3>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Please run an MRI prediction first to generate Grad-CAM++, SHAP, and LIME interpretability maps.
          </p>
          <button
            onClick={onUploadRedirect}
            className="px-5 py-2.5 rounded-xl bg-[#1d63ed] text-white font-semibold text-xs transition-colors"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  // Get current active explanation image
  let heatmapImageSrc: string | null = null;
  if (activeTab === 'GRADCAM') {
    const b64 = prediction.gradcam_images_base64?.[selectedBranch] || 
      (prediction.gradcam_images_base64 ? Object.values(prediction.gradcam_images_base64)[0] : null);
    if (b64) heatmapImageSrc = `data:image/png;base64,${b64}`;
  } else if (activeTab === 'SHAP') {
    if (prediction.shap_image_base64) heatmapImageSrc = `data:image/png;base64,${prediction.shap_image_base64}`;
  } else if (activeTab === 'LIME') {
    if (prediction.lime_image_base64) heatmapImageSrc = `data:image/png;base64,${prediction.lime_image_base64}`;
  }

  const methodName = activeTab === 'GRADCAM' ? 'Grad-CAM++' : activeTab;
  const targetClass = prediction.predicted_class || 'AD';

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">
            Explainable AI Results
          </h1>
          <p className="text-xs sm:text-sm text-[#5a7191] mt-0.5">
            Visual explanations showing which regions influenced the prediction.
          </p>
        </div>
        <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
      </div>

      {/* 3 Selectable Tabs: Grad-CAM++, SHAP, LIME */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('GRADCAM')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            activeTab === 'GRADCAM'
              ? 'bg-[#1d63ed] text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-[#475569] border border-[#dbe6f5]'
          }`}
        >
          <span>Grad-CAM++</span>
        </button>

        <button
          onClick={() => setActiveTab('SHAP')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            activeTab === 'SHAP'
              ? 'bg-[#1d63ed] text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-[#475569] border border-[#dbe6f5]'
          }`}
        >
          <span>SHAP</span>
        </button>

        <button
          onClick={() => setActiveTab('LIME')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            activeTab === 'LIME'
              ? 'bg-[#1d63ed] text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-[#475569] border border-[#dbe6f5]'
          }`}
        >
          <span>LIME</span>
        </button>

        {/* GradCAM Branch selector if multiple branches present */}
        {activeTab === 'GRADCAM' && branches.length > 1 && (
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="text-[#64748b] hidden sm:inline">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-white border border-[#dbe6f5] rounded-lg px-2.5 py-1.5 text-xs text-[#0f2445] font-semibold outline-none focus:border-[#1d63ed]"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b.toUpperCase()}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Comparison Section: Tri-panel or Dual-panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Images Area (Left Columns) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Original Slice */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0f2445]">
                <span>Original Slice</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-square flex items-center justify-center">
                {originalImageBase64 ? (
                  <img src={`data:image/png;base64,${originalImageBase64}`} alt="Original Slice" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-500 text-xs">Slice Unavailable</div>
                )}
              </div>
            </div>

            {/* 2. Heatmap */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0f2445]">
                <span>{methodName} Heatmap</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-square flex items-center justify-center">
                {heatmapImageSrc ? (
                  <img src={heatmapImageSrc} alt={`${methodName} Heatmap`} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-500 text-xs">Heatmap Unavailable</div>
                )}
              </div>
            </div>

            {/* 3. Overlay */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0f2445]">
                <span>Overlay</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-square flex items-center justify-center">
                {heatmapImageSrc ? (
                  <div className="relative w-full h-full">
                    {originalImageBase64 && (
                      <img src={`data:image/png;base64,${originalImageBase64}`} alt="Base" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    )}
                    <img src={heatmapImageSrc} alt="Overlay" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90" />
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs">Overlay Unavailable</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Details Panel (Right Column) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0f2445] pb-2 border-b border-[#eef4fb]">
            Explanation Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#64748b]">Method</span>
              <span className="font-semibold text-[#0f2445]">{methodName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#64748b]">Target Class</span>
              <span className="font-semibold text-[#0f2445]">{targetClass}</span>
            </div>

            <div className="pt-3 border-t border-[#eef4fb] space-y-2">
              <span className="text-[#64748b] block mb-2 font-medium">Most Active Regions</span>
              <div className="flex items-center gap-2 text-[#0f2445]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Temporal Lobe</span>
              </div>
              <div className="flex items-center gap-2 text-[#0f2445]">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Hippocampal Region</span>
              </div>
              <div className="flex items-center gap-2 text-[#0f2445]">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Parietal Region</span>
              </div>
            </div>
          </div>

          {/* Bottom Info Tip */}
          <div className="mt-5 rounded-xl bg-[#f0f6fc] border border-[#d6e4f5] p-3.5 flex items-start gap-2.5 text-xs text-[#475569]">
            <Info className="w-4 h-4 text-[#1d63ed] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Brighter regions indicate areas that contributed most to the prediction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
