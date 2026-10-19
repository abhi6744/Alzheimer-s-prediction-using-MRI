import { useState } from 'react';
import axios from 'axios';
import { Menu, AlertTriangle, X } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import type { NavPage } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { UploadPage } from './components/UploadPage';
import { PreprocessingPage } from './components/PreprocessingPage';
import { PredictionPage } from './components/PredictionPage';
import type { PredictionResultData } from './components/PredictionPage';
import { XaiPage } from './components/XaiPage';
import { HistoryPage } from './components/HistoryPage';
import { AboutPage } from './components/AboutPage';

const API_BASE = '/api';

interface PreprocessedData {
  slice_png_path: string;
  preprocessed_nii_path?: string;
  preview_base64?: string;
  filename?: string;
}

interface HistoryEntry {
  id: string;
  filename: string;
  timestamp: string;
  prediction: PredictionResultData;
  previewBase64?: string;
  preprocessedNiiPath?: string;
}

export function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Uploaded and preprocessed state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // 3D Preprocessing state
  const [isPreprocessing, setIsPreprocessing] = useState(false);
  const [preprocessStep, setPreprocessStep] = useState<number>(1);
  const [preprocessPercent, setPreprocessPercent] = useState<number>(0);
  const [preprocessStatus, setPreprocessStatus] = useState<string>('');
  const [preprocessedData, setPreprocessedData] = useState<PreprocessedData | null>(null);

  // Prediction & XAI state
  const [, setIsPredicting] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionResultData | null>(null);

  // Session History
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleStartProcess = async () => {
    if (!selectedFile) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { path, is_nifti, filename } = uploadRes.data;
      setIsUploading(false);

      if (is_nifti) {
        // Switch to Preprocess page with live step simulation during backend call
        setCurrentPage('preprocess');
        setIsPreprocessing(true);
        setPreprocessStep(2);
        setPreprocessPercent(25);
        setPreprocessStatus('Performing skull stripping (brain extraction)...');

        const stepTimer1 = setTimeout(() => {
          setPreprocessStep(3);
          setPreprocessPercent(55);
          setPreprocessStatus('Standardizing intensity normalization...');
        }, 1500);

        const stepTimer2 = setTimeout(() => {
          setPreprocessStep(4);
          setPreprocessPercent(85);
          setPreprocessStatus('Registering volume to MNI template space...');
        }, 3000);

        try {
          const prepRes = await axios.post(`${API_BASE}/preprocess`, {
            file_path: path,
            is_nifti: true
          });

          clearTimeout(stepTimer1);
          clearTimeout(stepTimer2);

          setPreprocessStep(5);
          setPreprocessPercent(100);
          setPreprocessStatus('Preprocessing completed successfully');
          setIsPreprocessing(false);

          const fullPrepData: PreprocessedData = {
            ...prepRes.data,
            filename: filename || selectedFile.name
          };
          setPreprocessedData(fullPrepData);

        } catch (err: any) {
          clearTimeout(stepTimer1);
          clearTimeout(stepTimer2);
          setIsPreprocessing(false);
          throw err;
        }

      } else {
        // PNG 2D Slice uploaded directly
        const prepRes = await axios.post(`${API_BASE}/preprocess`, {
          file_path: path,
          is_nifti: false
        });

        const fullPrepData: PreprocessedData = {
          slice_png_path: prepRes.data.slice_png_path,
          filename: filename || selectedFile.name
        };
        setPreprocessedData(fullPrepData);

        // Run prediction immediately
        await runPrediction(prepRes.data.slice_png_path, filename || selectedFile.name);
      }

    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      setIsPreprocessing(false);
      setError(err.response?.data?.detail || err.message || "An error occurred during processing.");
    }
  };

  const runPrediction = async (slicePath: string, currentFilename?: string) => {
    setIsPredicting(true);
    setError(null);
    setCurrentPage('prediction');

    try {
      const res = await axios.post(`${API_BASE}/predict`, { slice_png_path: slicePath });
      const pred: PredictionResultData = res.data;
      setPredictionData(pred);
      setIsPredicting(false);

      // Save to Session History
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        filename: currentFilename || preprocessedData?.filename || selectedFile?.name || 'MRI Scan',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        prediction: pred,
        previewBase64: preprocessedData?.preview_base64,
        preprocessedNiiPath: preprocessedData?.preprocessed_nii_path
      };

      setHistory(prev => [newEntry, ...prev]);

    } catch (err: any) {
      console.error(err);
      setIsPredicting(false);
      setError(err.response?.data?.detail || err.message || "An error occurred during prediction.");
    }
  };

  const handleDownloadNifti = () => {
    if (!preprocessedData?.preprocessed_nii_path) return;
    // Download preprocessed NIFTI file
    const link = document.createElement('a');
    link.href = `${API_BASE}/download?path=${encodeURIComponent(preprocessedData.preprocessed_nii_path)}`;
    link.download = preprocessedData.filename 
      ? `preprocessed_${preprocessedData.filename}`
      : 'preprocessed_mri.nii.gz';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectHistoryItem = (item: HistoryEntry) => {
    setPredictionData(item.prediction);
    if (item.previewBase64) {
      setPreprocessedData(prev => ({
        slice_png_path: prev?.slice_png_path || '',
        preview_base64: item.previewBase64,
        filename: item.filename,
        preprocessed_nii_path: item.preprocessedNiiPath
      }));
    }
    setCurrentPage('prediction');
  };

  const handleResetForNewScan = () => {
    setSelectedFile(null);
    setError(null);
    setCurrentPage('upload');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col md:flex-row font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setError(null);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onToggleMobile={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-[#e2eaf4] sticky top-0 z-20">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-[#0f2445]">Alzheimer's Detection</span>
          <div className="w-5" />
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentPage === 'home' && (
            <HomePage onNavigate={(page) => setCurrentPage(page)} />
          )}

          {currentPage === 'upload' && (
            <UploadPage
              onFileSelected={handleFileSelect}
              isLoading={isUploading}
              selectedFile={selectedFile}
              onClearFile={handleClearFile}
              onStartProcess={handleStartProcess}
            />
          )}

          {currentPage === 'preprocess' && (
            <PreprocessingPage
              isProcessing={isPreprocessing}
              progressStep={preprocessStep}
              progressPercent={preprocessPercent}
              statusText={preprocessStatus}
              preprocessedData={preprocessedData}
              onDownloadNifti={handleDownloadNifti}
              onRunPrediction={() => {
                if (preprocessedData?.slice_png_path) {
                  runPrediction(preprocessedData.slice_png_path, preprocessedData.filename);
                }
              }}
            />
          )}

          {currentPage === 'prediction' && (
            <PredictionPage
              prediction={predictionData}
              originalImageBase64={preprocessedData?.preview_base64}
              onNavigateToXai={() => setCurrentPage('xai')}
              onAnalyzeAnother={handleResetForNewScan}
            />
          )}

          {currentPage === 'xai' && (
            <XaiPage
              prediction={predictionData}
              originalImageBase64={preprocessedData?.preview_base64}
              onUploadRedirect={() => setCurrentPage('upload')}
            />
          )}

          {currentPage === 'history' && (
            <HistoryPage
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={() => setHistory([])}
              onNavigateToUpload={() => setCurrentPage('upload')}
            />
          )}

          {currentPage === 'about' && (
            <AboutPage />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
