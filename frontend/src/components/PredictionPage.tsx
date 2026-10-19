import React from 'react';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { BrainWatermark, BrainOutlineBadge } from './BrainIllustrations';

export interface PredictionResultData {
  predicted_class: 'AD' | 'CN';
  confidence_ad: number;
  confidence_cn: number;
  shap_image_base64?: string;
  lime_image_base64?: string;
  gradcam_images_base64?: Record<string, string>;
  model_info?: {
    model_name?: string;
    input_shape?: string;
    classes?: string;
    inference_time?: string;
  };
}

interface PredictionPageProps {
  prediction: PredictionResultData | null;
  originalImageBase64?: string;
  onNavigateToXai: () => void;
  onAnalyzeAnother: () => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  prediction,
  originalImageBase64,
  onNavigateToXai,
  onAnalyzeAnother
}) => {
  if (!prediction) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">Prediction Result</h1>
            <p className="text-xs sm:text-sm text-[#5a7191] mt-0.5">
              AI-based prediction for Alzheimer's disease using the ensemble model.
            </p>
          </div>
          <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
        </div>

        <div className="bg-white rounded-2xl border border-[#dbe6f5] p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2445]">No Prediction Result Yet</h3>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Please upload a brain MRI scan and run prediction to view classification and confidence results.
          </p>
          <button
            onClick={onAnalyzeAnother}
            className="px-5 py-2.5 rounded-xl bg-[#1d63ed] text-white font-semibold text-xs transition-colors"
          >
            Upload MRI Scan
          </button>
        </div>
      </div>
    );
  }

  const isAD = prediction.predicted_class === 'AD';
  const confidencePercent = (
    (isAD ? prediction.confidence_ad : prediction.confidence_cn) * 100
  ).toFixed(1);
  const adPercent = (prediction.confidence_ad * 100).toFixed(1);
  const cnPercent = (prediction.confidence_cn * 100).toFixed(1);

  // Model Info panel data
  const modelName = prediction.model_info?.model_name || 'best_ensemble_model (1).keras';
  const inputShape = prediction.model_info?.input_shape || '(224, 224, 3)';
  const classesText = prediction.model_info?.classes || '2 (AD, CN)';
  const inferenceTime = prediction.model_info?.inference_time || '0.8 seconds';

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">
            Prediction Result
          </h1>
          <p className="text-xs sm:text-sm text-[#5a7191] mt-0.5">
            AI-based prediction for Alzheimer's disease using the ensemble model.
          </p>
        </div>
        <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
      </div>

      {/* Top 2 Cards: Left Prediction Card (with Brain badge) & Right Class Probabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Prominent Prediction Card */}
        <div className={`lg:col-span-7 rounded-2xl border p-7 shadow-xs flex flex-col justify-between ${
          isAD 
            ? 'bg-[#fff8f7] border-[#ffdcd6]' 
            : 'bg-[#f4fbf7] border-[#ccefdc]'
        }`}>
          <div className="flex items-start gap-5">
            {/* Brain Badge Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
              isAD ? 'bg-[#ffedeb] text-[#ef4444]' : 'bg-[#e7f7ed] text-[#16a34a]'
            }`}>
              <BrainOutlineBadge className={`w-7 h-7 ${isAD ? 'text-[#ef4444]' : 'text-[#16a34a]'}`} />
            </div>

            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                isAD ? 'text-[#f87171]' : 'text-[#22c55e]'
              }`}>
                Prediction
              </span>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 ${
                isAD ? 'text-[#e11d48]' : 'text-[#15803d]'
              }`}>
                {isAD ? "Alzheimer's Disease (AD)" : "Cognitively Normal (CN)"}
              </h2>
              <p className="text-xs font-semibold text-[#475569] mt-2">
                Confidence: <span className="font-bold text-[#0f2445]">{confidencePercent}%</span>
              </p>
            </div>
          </div>

          {/* Solid accent bar at bottom of card */}
          <div className="mt-6 w-full h-1.5 rounded-full overflow-hidden bg-slate-200/50">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                isAD ? 'bg-[#ef4444]' : 'bg-[#16a34a]'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        {/* Right: Class Probabilities Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-[#0f2445] pb-2 border-b border-[#eef4fb]">
            Class Probabilities
          </h3>

          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {/* AD Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#334155]">AD (Alzheimer's Disease)</span>
                <span className="font-mono text-[#0f2445] font-bold">{adPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-[#ef4444] rounded-full transition-all duration-1000"
                  style={{ width: `${adPercent}%` }}
                />
              </div>
            </div>

            {/* CN Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#334155]">CN (Cognitively Normal)</span>
                <span className="font-mono text-[#0f2445] font-bold">{cnPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-[#1d63ed] rounded-full transition-all duration-1000"
                  style={{ width: `${cnPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards: Left Input Image (Middle Slice) & Right Model Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Input Image (Middle Slice) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0f2445]">Input Image (Middle Slice)</h3>
            <span className="text-[11px] text-[#64748b] font-medium font-mono">224 x 224</span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video sm:aspect-[2/1] flex items-center justify-center">
            {originalImageBase64 ? (
              <img 
                src={`data:image/png;base64,${originalImageBase64}`} 
                alt="Input Middle Slice" 
                className="h-full w-auto object-contain"
              />
            ) : (
              <div className="text-slate-500 text-xs">Middle Slice Preview Unavailable</div>
            )}
          </div>
        </div>

        {/* Right: Model Information Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-[#0f2445] pb-2 border-b border-[#eef4fb]">
            Model Information
          </h3>

          <div className="space-y-3 text-xs flex-1">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#64748b]">Model</span>
              <span className="font-medium text-[#0f2445] font-mono truncate max-w-[180px]">{modelName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#64748b]">Input Shape</span>
              <span className="font-medium text-[#0f2445] font-mono">{inputShape}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#64748b]">Classes</span>
              <span className="font-medium text-[#0f2445]">{classesText}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#64748b]">Inference Time</span>
              <span className="font-medium text-[#0f2445]">{inferenceTime}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#eef4fb] flex items-center justify-between gap-3">
            <button
              onClick={onAnalyzeAnother}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>

            <button
              onClick={onNavigateToXai}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-[#1554cf] text-white text-xs font-semibold transition-all shadow-xs"
            >
              <span>View XAI Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
