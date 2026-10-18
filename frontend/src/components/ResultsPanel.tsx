import { useState } from 'react';

interface PredictionData {
  predicted_class: 'AD' | 'CN';
  confidence_ad: number;
  confidence_cn: number;
  shap_image_base64: string;
  lime_image_base64: string;
  gradcam_images_base64: Record<string, string>;
}

interface ResultsPanelProps {
  prediction: PredictionData;
  originalImageBase64?: string;
}

const ResultsPanel = ({ prediction, originalImageBase64 }: ResultsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'SHAP' | 'LIME' | 'GRADCAM'>('GRADCAM');
  const [activeGradCamBranch, setActiveGradCamBranch] = useState<string>(
    Object.keys(prediction.gradcam_images_base64)[0] || ''
  );

  const isAD = prediction.predicted_class === 'AD';
  const confidence = isAD ? prediction.confidence_ad : prediction.confidence_cn;
  
  return (
    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`p-6 rounded-xl border flex flex-col md:flex-row items-center justify-between shadow-lg
        ${isAD ? 'bg-red-900/20 border-red-500/30' : 'bg-emerald-900/20 border-emerald-500/30'}
      `}>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-1">Diagnosis Prediction</h2>
          <div className="flex items-baseline space-x-3">
            <span className={`text-4xl font-bold ${isAD ? 'text-red-400' : 'text-emerald-400'}`}>
              {isAD ? 'Alzheimer\'s Disease (AD)' : 'Cognitively Normal (CN)'}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm text-slate-500 mb-2">Model Confidence</p>
          <div className="flex items-center space-x-4">
            <div className="w-48 h-3 bg-white rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${isAD ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${(confidence * 100).toFixed(1)}%` }}
              ></div>
            </div>
            <span className="font-mono text-lg font-medium text-slate-700">
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-neuro-100 border border-neuro-200 rounded-xl overflow-hidden shadow-xl">
        <div className="border-b border-neuro-200 flex">
          {['GRADCAM', 'SHAP', 'LIME'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors
                ${activeTab === tab ? 'bg-neuro-700/50 text-slate-900 border-b-2 border-neuro-blue' : 'text-slate-500 hover:text-slate-700 hover:bg-neuro-700/30'}
              `}
            >
              {tab === 'GRADCAM' ? 'Grad-CAM++' : tab} Explanation
            </button>
          ))}
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
            
            {originalImageBase64 && (
              <div className="flex flex-col items-center w-full md:w-1/2 max-w-sm">
                <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Input MRI Slice</p>
                <div className="relative rounded-lg overflow-hidden border border-neuro-200 bg-black aspect-square w-full flex items-center justify-center">
                  <img src={`data:image/png;base64,${originalImageBase64}`} alt="Original MRI Slice" className="w-full h-full object-contain" />
                </div>
              </div>
            )}

            <div className={`flex flex-col items-center w-full max-w-sm ${originalImageBase64 ? 'md:w-1/2' : ''}`}>
              <div className="flex items-center justify-between w-full mb-3">
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Algorithm Output</p>
                 {activeTab === 'GRADCAM' && (
                    <select 
                      className="bg-white border border-neuro-200 text-xs text-slate-600 rounded px-2 py-1 outline-none focus:border-neuro-blue"
                      value={activeGradCamBranch}
                      onChange={(e) => setActiveGradCamBranch(e.target.value)}
                    >
                      {Object.keys(prediction.gradcam_images_base64).map(branch => (
                        <option key={branch} value={branch}>{branch.toUpperCase()}</option>
                      ))}
                    </select>
                 )}
              </div>
              <div className="relative rounded-lg overflow-hidden border border-neuro-200 bg-white aspect-square w-full flex items-center justify-center">
                {activeTab === 'SHAP' && <img src={`data:image/png;base64,${prediction.shap_image_base64}`} alt="SHAP" className="w-full h-full object-contain" />}
                {activeTab === 'LIME' && <img src={`data:image/png;base64,${prediction.lime_image_base64}`} alt="LIME" className="w-full h-full object-contain" />}
                {activeTab === 'GRADCAM' && prediction.gradcam_images_base64[activeGradCamBranch] && (
                  <img src={`data:image/png;base64,${prediction.gradcam_images_base64[activeGradCamBranch]}`} alt="Grad-CAM" className="w-full h-full object-contain" />
                )}
              </div>
            </div>

          </div>

          <div className="mt-6 text-sm text-slate-500 bg-white/50 p-4 rounded-lg border border-neuro-200/50">
            {activeTab === 'SHAP' && "SHAP (SHapley Additive exPlanations) highlights regions that pushed the model towards (red) or away from (blue) the predicted class."}
            {activeTab === 'LIME' && "LIME (Local Interpretable Model-agnostic Explanations) perturbs the image superpixels to identify which local features were most influential."}
            {activeTab === 'GRADCAM' && "Grad-CAM++ uses the gradients of the target class flowing into the final convolutional layer to produce a coarse localization map."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
