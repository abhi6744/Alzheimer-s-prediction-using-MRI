import { Calendar, CheckCircle, Database } from 'lucide-react';
import { BrainWatermark } from './BrainIllustrations';
import type { PredictionResultData } from './PredictionPage';

interface HistoryItem {
  id: string;
  filename: string;
  timestamp: string;
  prediction: PredictionResultData;
  previewBase64?: string;
  preprocessedNiiPath?: string;
}

interface HistoryPageProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onNavigateToUpload: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onNavigateToUpload
}) => {
  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-[#eef4fb] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2445] tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-[#5a7191] mt-0.5">
            Previous MRI analyses, predictions, and downloadable assets.
          </p>
        </div>
        <BrainWatermark className="w-12 h-12 text-blue-200/50 flex-shrink-0 hidden sm:block" />
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#dbe6f5] p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2445]">No Analysis Records</h3>
          <p className="text-xs text-[#64748b] leading-relaxed">
            All scanned scans and prediction runs from your session will appear here for quick review and download.
          </p>
          <button
            onClick={onNavigateToUpload}
            className="px-5 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-xs transition-colors"
          >
            Upload MRI Scan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Clear Session History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {history.map((item) => {
              const isAD = item.prediction.predicted_class === 'AD';
              const conf = (
                (isAD ? item.prediction.confidence_ad : item.prediction.confidence_cn) * 100
              ).toFixed(1);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#dbe6f5] p-5 shadow-xs hover:border-[#b8d4fa] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isAD 
                          ? 'bg-[#ffedeb] text-[#e11d48]' 
                          : 'bg-[#e7f7ed] text-[#15803d]'
                      }`}>
                        {isAD ? 'AD (Alzheimer\'s)' : 'CN (Normal)'}
                      </span>
                      <span className="text-[11px] font-mono text-[#64748b]">{conf}% Conf</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.previewBase64 && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-black flex-shrink-0">
                          <img 
                            src={`data:image/png;base64,${item.previewBase64}`} 
                            alt="Slice preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0f2445] truncate" title={item.filename}>
                          {item.filename}
                        </p>
                        <p className="text-[11px] text-[#64748b] flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.timestamp}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#eef4fb] flex items-center justify-between">
                    <button
                      onClick={() => onSelectHistoryItem(item)}
                      className="text-xs font-semibold text-[#1d63ed] hover:underline"
                    >
                      View Details
                    </button>
                    {item.preprocessedNiiPath && (
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> 3D NIFTI Saved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
