import { useState } from 'react';
import axios from 'axios';
import { Brain, Activity, Download, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import UploadDropzone from './components/UploadDropzone';
import ResultsPanel from './components/ResultsPanel';
import MedicalDisclaimer from './components/MedicalDisclaimer';

// Use relative URL for API so it works when served from FastAPI
const API_BASE = '/api';

function App() {
  const [step, setStep] = useState<'UPLOAD' | 'PROCESSING' | 'PREPROCESSED' | 'ANALYZING' | 'RESULTS'>('UPLOAD');
  const [error, setError] = useState<string | null>(null);
  
  const [preprocessedData, setPreprocessedData] = useState<{
    slice_png_path: string;
    preprocessed_nii_path?: string;
    preview_base64?: string;
  } | null>(null);

  const [predictionData, setPredictionData] = useState<any>(null);

  const resetState = () => {
    setStep('UPLOAD');
    setError(null);
    setPreprocessedData(null);
    setPredictionData(null);
  };

  const handleFileSelect = async (selectedFile: File) => {
    resetState();
    setError(null);
    setStep('PROCESSING');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { path, is_nifti } = uploadRes.data;

      const prepRes = await axios.post(`${API_BASE}/preprocess`, {
        file_path: path,
        is_nifti: is_nifti
      });

      setPreprocessedData(prepRes.data);
      
      if (is_nifti) {
        setStep('PREPROCESSED');
      } else {
        runAnalysis(prepRes.data.slice_png_path);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "An error occurred during upload/preprocessing.");
      setStep('UPLOAD');
    }
  };

  const runAnalysis = async (slicePath: string) => {
    setStep('ANALYZING');
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/predict`, { slice_png_path: slicePath });
      setPredictionData(res.data);
      setStep('RESULTS');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "An error occurred during prediction.");
      setStep(preprocessedData?.preprocessed_nii_path ? 'PREPROCESSED' : 'UPLOAD');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b border-neuro-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={resetState}>
            <div className="p-2 bg-neuro-blue/10 rounded-lg">
              <Brain className="w-6 h-6 text-neuro-blue" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Neuro<span className="text-neuro-blue">Detect</span> AD</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {step === 'UPLOAD' && (
          <div className="text-center max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-neuro-100 border border-neuro-200 px-4 py-1.5 rounded-full text-sm text-neuro-cyan mb-6">
              <Activity className="w-4 h-4" />
              <span>Ensemble Deep Learning + XAI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Alzheimer's Disease <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-neuro-blue to-neuro-violet">Detection & Analysis</span>
            </h2>
            <p className="text-lg text-slate-500">
              Upload an MRI scan to predict the likelihood of Alzheimer's Disease (AD) versus Cognitively Normal (CN). Powered by a multi-branch neural network ensemble with SHAP, LIME, and Grad-CAM++ explanations.
            </p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center">
             <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
             <p>{error}</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {(step === 'UPLOAD' || step === 'PROCESSING') && (
            <UploadDropzone onFileSelect={handleFileSelect} isLoading={step === 'PROCESSING'} />
          )}

          {step === 'PROCESSING' && (
            <div className="mt-8 flex flex-col items-center justify-center space-y-4 text-neuro-blue">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-medium animate-pulse">Running 3D Preprocessing Pipeline (Brain Extraction, SyN Registration)...</p>
            </div>
          )}

          {step === 'PREPROCESSED' && preprocessedData && (
            <div className="mt-12 p-8 bg-neuro-100 border border-neuro-200 rounded-xl shadow-xl animate-in fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Preprocessing Complete</h3>
                  <p className="text-slate-500 mb-6">
                    The 3D MRI volume has been skull-stripped, registered to the MNI152 template, normalized, and the middle axial slice has been extracted for analysis.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex items-center justify-center px-6 py-3 bg-white border border-neuro-200 hover:border-neuro-500 rounded-lg text-slate-700 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Download 3D MRI
                    </button>
                    <button 
                      onClick={() => runAnalysis(preprocessedData.slice_png_path)}
                      className="flex items-center justify-center px-6 py-3 bg-neuro-blue hover:bg-blue-600 rounded-lg text-slate-900 font-medium transition-colors shadow-lg shadow-blue-500/20"
                    >
                      Run AD Prediction
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>

                {preprocessedData.preview_base64 && (
                  <div className="w-48 h-48 rounded-lg overflow-hidden border border-neuro-200 bg-black flex-shrink-0 relative group">
                    <img src={`data:image/png;base64,${preprocessedData.preview_base64}`} alt="Extracted Slice" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-medium uppercase tracking-widest text-slate-900">Middle Slice</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'ANALYZING' && (
            <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-neuro-violet">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-medium animate-pulse">Running Ensemble Inference & Generating XAI Overlays...</p>
            </div>
          )}

          {step === 'RESULTS' && predictionData && (
            <>
               <ResultsPanel prediction={predictionData} originalImageBase64={preprocessedData?.preview_base64} />
               
               <div className="mt-8 flex justify-center">
                 <button 
                   onClick={resetState}
                   className="px-6 py-2 border border-neuro-200 hover:bg-neuro-100 rounded-lg text-slate-600 transition-colors"
                 >
                   Analyze Another Scan
                 </button>
               </div>
            </>
          )}
        </div>
        <MedicalDisclaimer />
      </main>
    </div>
  );
}

export default App;
