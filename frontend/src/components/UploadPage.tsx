import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { 
  Box, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Info, 
  FileCheck, 
  X, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { BrainWatermark } from './BrainIllustrations';

interface UploadPageProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  selectedFile: File | null;
  onClearFile: () => void;
  onStartProcess: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  onFileSelected,
  isLoading,
  selectedFile,
  onClearFile,
  onStartProcess
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const niftiInputRef = useRef<HTMLInputElement>(null);
  const pngInputRef = useRef<HTMLInputElement>(null);
  const generalDropRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setValidationError(null);
    const name = file.name.toLowerCase();
    const isNifti = name.endsWith('.nii') || name.endsWith('.nii.gz');
    const isPng = name.endsWith('.png');

    if (!isNifti && !isPng) {
      setValidationError("Invalid file format. Please upload a 3D MRI (.nii, .nii.gz) or 2D slice (.png).");
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      setValidationError("File is too large. Maximum supported file size is 200MB.");
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const isNifti = selectedFile?.name.toLowerCase().endsWith('.nii') || selectedFile?.name.toLowerCase().endsWith('.nii.gz');

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Top Header with Brain Watermark */}
      <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">
            Upload MRI Scan
          </h1>
          <p className="text-xs sm:text-sm text-[#5a7191] mt-1">
            Upload either a raw 3D T1 MRI (.nii or .nii.gz) or a preprocessed 2D slice (.png) for Alzheimer's disease analysis.
          </p>
        </div>
        <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
      </div>

      {/* Validation / Error banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Two Main Cards: 3D MRI (Raw) and 2D MRI Slice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: 3D MRI (Raw) */}
        <div className="bg-white rounded-2xl border border-[#dbe6f5] p-7 shadow-xs flex flex-col justify-between hover:border-[#b8d4fa] transition-all">
          <div>
            {/* Blue Icon */}
            <div className="flex items-center justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#f0f6ff] text-[#1d63ed] flex items-center justify-center shadow-xs">
                <Box className="w-7 h-7" />
              </div>
            </div>

            {/* Title & subtitle */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-[#0f2445]">3D MRI (Raw)</h3>
              <p className="text-xs text-[#64748b] mt-0.5 font-medium">.nii or .nii.gz</p>
            </div>

            {/* Feature Bullets with green checks */}
            <ul className="space-y-3 mb-8 text-xs sm:text-[13px] text-[#475569]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span>Full preprocessing pipeline</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span>Skull stripping & normalization</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span>Extracts middle slice automatically</span>
              </li>
            </ul>
          </div>

          <div>
            <input 
              type="file" 
              ref={niftiInputRef} 
              className="hidden" 
              accept=".nii,.nii.gz"
              onChange={(e) => e.target.files?.[0] && validateAndSelect(e.target.files[0])}
            />
            <button
              onClick={() => niftiInputRef.current?.click()}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              Choose 3D MRI File
            </button>
          </div>
        </div>

        {/* Card 2: 2D MRI Slice */}
        <div className="bg-white rounded-2xl border border-[#dbe6f5] p-7 shadow-xs flex flex-col justify-between hover:border-[#b8d4fa] transition-all">
          <div>
            {/* Blue Icon */}
            <div className="flex items-center justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#f0f6ff] text-[#1d63ed] flex items-center justify-center shadow-xs">
                <ImageIcon className="w-7 h-7" />
              </div>
            </div>

            {/* Title & subtitle */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-[#0f2445]">2D MRI Slice</h3>
              <p className="text-xs text-[#64748b] mt-0.5 font-medium">.png</p>
            </div>

            {/* Feature Bullets with green checks */}
            <ul className="space-y-3 mb-8 text-xs sm:text-[13px] text-[#475569]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span>Use preprocessed 2D slice directly</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span>Skip 3D preprocessing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span>Faster prediction</span>
              </li>
            </ul>
          </div>

          <div>
            <input 
              type="file" 
              ref={pngInputRef} 
              className="hidden" 
              accept=".png"
              onChange={(e) => e.target.files?.[0] && validateAndSelect(e.target.files[0])}
            />
            <button
              onClick={() => pngInputRef.current?.click()}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#1d63ed] border border-[#cfe1fd] font-semibold text-sm transition-all shadow-xs active:scale-[0.99] disabled:opacity-50"
            >
              Choose PNG File
            </button>
          </div>
        </div>
      </div>

      {/* Selected File Details Banner or Drag & Drop Area */}
      {selectedFile ? (
        <div className="p-5 rounded-2xl bg-white border border-[#b8d4fa] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0f2445] truncate">{selectedFile.name}</p>
              <p className="text-xs text-[#64748b] mt-0.5">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {isNifti ? 'Raw 3D NIFTI Volume' : 'Preprocessed 2D PNG'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClearFile}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>

            <button
              onClick={onStartProcess}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isNifti ? 'Start 3D Preprocessing' : 'Run Prediction'}</span>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Drag and drop your file here area matching reference */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => generalDropRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-[#1d63ed] bg-[#eef5fe]' 
              : 'border-[#cfe1fd] bg-[#f8fbfe]/60 hover:bg-[#f1f7fd] hover:border-[#1d63ed]'
          }`}
        >
          <input 
            type="file" 
            ref={generalDropRef} 
            className="hidden" 
            accept=".nii,.nii.gz,.png"
            onChange={(e) => e.target.files?.[0] && validateAndSelect(e.target.files[0])}
          />
          <div className="w-12 h-12 rounded-full bg-white text-[#1d63ed] shadow-xs border border-[#e2eaf4] flex items-center justify-center mb-3">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-[#0f2445]">Drag and drop your file here</p>
          <p className="text-xs text-[#64748b] mt-1">or click the button above to browse</p>
        </div>
      )}

      {/* Info notice bar at bottom */}
      <div className="rounded-xl bg-[#f0f6fc] border border-[#d6e4f5] px-4 py-3 flex items-start sm:items-center gap-3 text-xs text-[#475569]">
        <Info className="w-4 h-4 text-[#1d63ed] flex-shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <span className="font-medium text-[#0f2445]">Supported formats:</span> .nii, .nii.gz (3D MRI) and .png (2D slice) • Maximum file size: 200MB
        </div>
      </div>
    </div>
  );
};
