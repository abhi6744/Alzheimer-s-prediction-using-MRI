import { useCallback, useState } from 'react';
import type { DragEvent } from 'react';
import { UploadCloud, File, Image as ImageIcon, X } from 'lucide-react';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const UploadDropzone = ({ onFileSelect, isLoading }: UploadDropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [isLoading]);

  const handleFile = (file: File) => {
    const validExts = ['.nii', '.nii.gz', '.png'];
    const isValid = validExts.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValid) {
      alert("Invalid file type. Only .nii, .nii.gz, or .png are supported.");
      return;
    }
    
    if (file.size > 200 * 1024 * 1024) {
      alert("File too large. Maximum size is 200MB.");
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };

  const isNifti = selectedFile?.name.endsWith('.nii') || selectedFile?.name.endsWith('.nii.gz');

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors
            ${isDragOver ? 'border-neuro-blue bg-neuro-100' : 'border-neuro-200 bg-white/50 hover:border-neuro-blue hover:bg-neuro-100/50'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => {
            if (isLoading) return;
            document.getElementById('file-upload')?.click();
          }}
        >
          <UploadCloud className={`w-16 h-16 mb-4 ${isDragOver ? 'text-neuro-blue' : 'text-slate-500'}`} />
          <p className="text-lg font-medium text-slate-700 mb-2">Drag & Drop your MRI scan here</p>
          <p className="text-sm text-slate-500 mb-6">Supports Raw 3D T1 NIFTI (.nii, .nii.gz) or Preprocessed 2D Slice (.png)</p>
          <button className="bg-neuro-blue hover:bg-blue-600 text-slate-900 px-6 py-2 rounded-lg font-medium transition-colors">
            Browse Files
          </button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".nii,.nii.gz,.png"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="bg-neuro-100 border border-neuro-200 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-neuro-blue">
              {isNifti ? <File className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
            </div>
            <div>
              <p className="font-semibold text-slate-700">{selectedFile.name}</p>
              <p className="text-sm text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {isNifti ? 'Raw 3D MRI Volume' : 'Preprocessed 2D Slice'}
              </p>
            </div>
          </div>
          {!isLoading && (
            <button onClick={() => setSelectedFile(null)} className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;
