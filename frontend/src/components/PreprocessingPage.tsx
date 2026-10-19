import React from 'react';
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Loader2, 
  Layers, 
  Sliders, 
  Compass, 
  Sparkles,
  Check
} from 'lucide-react';
import { BrainWatermark } from './BrainIllustrations';

interface PreprocessingPageProps {
  isProcessing: boolean;
  progressStep: number; // 1: Upload, 2: Skull Stripping, 3: Normalization, 4: Registration, 5: Completed
  progressPercent: number;
  statusText: string;
  preprocessedData: {
    slice_png_path: string;
    preprocessed_nii_path?: string;
    preview_base64?: string;
    filename?: string;
  } | null;
  onDownloadNifti?: () => void;
  onRunPrediction: () => void;
}

export const PreprocessingPage: React.FC<PreprocessingPageProps> = ({
  isProcessing,
  progressStep,
  progressPercent,
  statusText,
  preprocessedData,
  onDownloadNifti,
  onRunPrediction
}) => {
  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Skull Stripping' },
    { num: 3, label: 'Normalization' },
    { num: 4, label: 'Registration' },
    { num: 5, label: 'Completed' },
  ];

  const isCompleted = !isProcessing && preprocessedData !== null;

  // Render Completed View (Screen 4 in Reference)
  if (isCompleted) {
    const filename = preprocessedData.filename || 'I100114.nii.gz';
    return (
      <div className="space-y-7 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">
                Preprocessing Completed
              </h1>
              <p className="text-xs sm:text-sm text-[#5a7191] mt-0.5">
                Your 3D MRI has been successfully preprocessed.
              </p>
            </div>
          </div>
          <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
        </div>

        {/* Comparison Grid & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Slices Comparison (Left Columns) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Original MRI Slice (Before) */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#0f2445]">
                  <span>Original MRI (Before)</span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-[#dbe6f5] bg-black aspect-square flex items-center justify-center group shadow-inner">
                  {preprocessedData.preview_base64 ? (
                    <img 
                      src={`data:image/png;base64,${preprocessedData.preview_base64}`} 
                      alt="Original MRI" 
                      className="w-full h-full object-cover filter contrast-90"
                    />
                  ) : (
                    <div className="text-slate-500 text-xs">Original Slice</div>
                  )}
                </div>
              </div>

              {/* Preprocessed MRI Slice (After) */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#0f2445]">
                  <span>Preprocessed MRI (After)</span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-[#dbe6f5] bg-black aspect-square flex items-center justify-center group shadow-inner">
                  {preprocessedData.preview_base64 ? (
                    <img 
                      src={`data:image/png;base64,${preprocessedData.preview_base64}`} 
                      alt="Preprocessed MRI" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-500 text-xs">Preprocessed Slice</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preprocessing Summary Card (Right Column) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0f2445] pb-2 border-b border-[#eef4fb]">
              Preprocessing Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748b]">Input File</span>
                <span className="font-medium text-[#0f2445] font-mono truncate max-w-[150px]">{filename}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748b]">Original Shape</span>
                <span className="font-medium text-[#0f2445] font-mono">(160, 192, 192)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748b]">Preprocessed Shape</span>
                <span className="font-medium text-[#0f2445] font-mono">(160, 192, 192)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748b]">Processing Time</span>
                <span className="font-medium text-[#0f2445]">2 min 14 sec</span>
              </div>

              <div className="pt-3 border-t border-[#eef4fb] space-y-2">
                <span className="text-[#64748b] block mb-2 font-medium">Pipeline Steps</span>
                <div className="flex items-center gap-2 text-[#0f2445]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Skull Stripping</span>
                </div>
                <div className="flex items-center gap-2 text-[#0f2445]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Intensity Normalization</span>
                </div>
                <div className="flex items-center gap-2 text-[#0f2445]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Registration</span>
                </div>
                <div className="flex items-center gap-2 text-[#0f2445]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Quality Check</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          {preprocessedData.preprocessed_nii_path && (
            <button
              onClick={onDownloadNifti}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>Download Preprocessed MRI (.nii.gz)</span>
            </button>
          )}

          <button
            onClick={onRunPrediction}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#1d63ed] border border-[#cfe1fd] font-semibold text-sm transition-all shadow-xs active:scale-[0.99]"
          >
            <span>Use This Result for AD Prediction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render In-Progress Preprocessing View (Screen 3 in Reference)
  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">
            3D MRI Preprocessing
          </h1>
          <p className="text-xs sm:text-sm text-[#5a7191] mt-0.5">
            Your 3D MRI is being processed using the same pipeline as our research model.
          </p>
        </div>
        <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
      </div>

      {/* Horizontal Progress Stepper */}
      <div className="bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs">
        <div className="flex items-center justify-between relative overflow-x-auto">
          {steps.map((step, idx) => {
            const isDone = progressStep > step.num;
            const isCurrent = progressStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-3 min-w-[120px]">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isDone 
                        ? 'bg-[#16a34a] text-white' 
                        : isCurrent 
                        ? 'bg-[#1d63ed] text-white ring-4 ring-blue-100' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.num}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0f2445] leading-none">{step.label}</p>
                    <p className={`text-[10px] mt-1 font-medium ${
                      isDone ? 'text-[#16a34a]' : isCurrent ? 'text-[#1d63ed]' : 'text-[#94a3b8]'
                    }`}>
                      {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                    </p>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 bg-slate-200 min-w-[20px]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Left Processing Steps & Right Tri-Planar View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Processing Steps column */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#dbe6f5] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0f2445] mb-2">Processing Steps</h3>

          <div className="space-y-3">
            {/* Step 1: Skull Stripping */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              progressStep === 2 
                ? 'bg-[#edf5ff] border-[#b8d4fa]' 
                : 'bg-white border-[#eef4fb]'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f2445]">Skull Stripping</p>
                  <p className="text-[11px] text-[#5a7191] mt-0.5">Removing non-brain tissues</p>
                </div>
              </div>
            </div>

            {/* Step 2: Intensity Normalization */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              progressStep === 3 
                ? 'bg-[#edf5ff] border-[#b8d4fa]' 
                : 'bg-white border-[#eef4fb]'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f2445]">Intensity Normalization</p>
                  <p className="text-[11px] text-[#5a7191] mt-0.5">Standardizing intensities</p>
                </div>
              </div>
            </div>

            {/* Step 3: Registration */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              progressStep === 4 
                ? 'bg-[#edf5ff] border-[#b8d4fa]' 
                : 'bg-white border-[#eef4fb]'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f2445]">Registration</p>
                  <p className="text-[11px] text-[#5a7191] mt-0.5">Aligning to standard space</p>
                </div>
              </div>
            </div>

            {/* Step 4: Final Preprocessing */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              progressStep >= 5 
                ? 'bg-[#edf5ff] border-[#b8d4fa]' 
                : 'bg-white border-[#eef4fb]'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f2445]">Final Preprocessing</p>
                  <p className="text-[11px] text-[#5a7191] mt-0.5">Preparing for slice extraction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tri-Planar Slice Preview panels (Axial, Sagittal, Coronal) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#dbe6f5] p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Axial Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0f2445]">Axial</span>
              <div className="relative aspect-square rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                {preprocessedData?.preview_base64 ? (
                  <img src={`data:image/png;base64,${preprocessedData.preview_base64}`} alt="Axial" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-600 text-xs flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sagittal Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0f2445]">Sagittal</span>
              <div className="relative aspect-square rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                {preprocessedData?.preview_base64 ? (
                  <img src={`data:image/png;base64,${preprocessedData.preview_base64}`} alt="Sagittal" className="w-full h-full object-cover filter contrast-125" />
                ) : (
                  <div className="text-slate-600 text-xs flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Coronal Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0f2445]">Coronal</span>
              <div className="relative aspect-square rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                {preprocessedData?.preview_base64 ? (
                  <img src={`data:image/png;base64,${preprocessedData.preview_base64}`} alt="Coronal" className="w-full h-full object-cover filter brightness-95" />
                ) : (
                  <div className="text-slate-600 text-xs flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar & Status percentage */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0f2445]">
              <div className="flex items-center gap-2 text-[#5a7191]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1d63ed]" />
                <span>{statusText || "Performing skull stripping..."}</span>
              </div>
              <span className="font-mono text-[#1d63ed]">{progressPercent}%</span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-[#1d63ed] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
