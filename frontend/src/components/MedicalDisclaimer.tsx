import { AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = () => {
  return (
    <div className="bg-neuro-100 border border-neuro-200 rounded-lg p-4 mt-8 flex items-start space-x-3 text-sm text-slate-600 shadow-md">
      <AlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-slate-700 mb-1">Research & Decision-Support Tool</p>
        <p>
          This application is intended for research and educational purposes only. It is <strong>not</strong> a medical device and should not be used for clinical diagnosis. The predictions and explainable AI (XAI) overlays are algorithmic interpretations and must be reviewed by a qualified medical professional.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
