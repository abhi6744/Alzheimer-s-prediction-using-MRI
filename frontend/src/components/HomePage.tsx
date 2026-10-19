import { ArrowRight, BookOpen, Layers, Activity, Search, Download } from 'lucide-react';
import { BrainHeroGraphic } from './BrainIllustrations';
import type { NavPage } from './Sidebar';

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#f6faff] to-[#edf4fc] border border-[#dbe6f5] shadow-xs p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#e7f1ff] text-[#1d63ed] border border-[#cfe1fd]">
              <span>MRI-based AD Detection (Research Project)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0f2445] tracking-tight leading-[1.18]">
              Detect Alzheimer's Disease <br className="hidden sm:inline" />
              with <span className="text-[#1d63ed]">AI</span>
            </h1>

            {/* Explanation paragraph */}
            <p className="text-base text-[#4a5f7d] leading-relaxed max-w-xl">
              Upload a brain MRI (3D .nii/.nii.gz or 2D .png) to get Alzheimer's prediction with AI-powered explanations (Grad-CAM++, SHAP, LIME).
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('upload')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-blue-500/20 active:scale-[0.98]"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#1d63ed] border border-[#cfe1fd] font-semibold text-sm transition-all duration-150 shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Right Neuroscience Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <BrainHeroGraphic />
          </div>
        </div>
      </div>

      {/* 4 Feature Cards matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: 3D MRI Preprocessing */}
        <div 
          onClick={() => onNavigate('preprocess')}
          className="group relative bg-white hover:bg-[#fbfdff] rounded-2xl border border-[#dbe6f5] hover:border-[#b8d4fa] p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f2445] mb-2 group-hover:text-[#1d63ed] transition-colors">
              3D MRI Preprocessing
            </h3>
            <p className="text-xs text-[#5a7191] leading-relaxed">
              Skull stripping, normalization and preparation
            </p>
          </div>
          <div className="pt-4 flex justify-end text-[#1d63ed]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 2: AI Prediction */}
        <div 
          onClick={() => onNavigate('prediction')}
          className="group relative bg-white hover:bg-[#fbfdff] rounded-2xl border border-[#dbe6f5] hover:border-[#b8d4fa] p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f2445] mb-2 group-hover:text-[#1d63ed] transition-colors">
              AI Prediction
            </h3>
            <p className="text-xs text-[#5a7191] leading-relaxed">
              AD vs CN classification using ensemble model
            </p>
          </div>
          <div className="pt-4 flex justify-end text-[#1d63ed]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 3: Explainable AI */}
        <div 
          onClick={() => onNavigate('xai')}
          className="group relative bg-white hover:bg-[#fbfdff] rounded-2xl border border-[#dbe6f5] hover:border-[#b8d4fa] p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f2445] mb-2 group-hover:text-[#1d63ed] transition-colors">
              Explainable AI
            </h3>
            <p className="text-xs text-[#5a7191] leading-relaxed">
              Grad-CAM++, SHAP and LIME visualizations
            </p>
          </div>
          <div className="pt-4 flex justify-end text-[#1d63ed]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 4: Download Results */}
        <div 
          onClick={() => onNavigate('history')}
          className="group relative bg-white hover:bg-[#fbfdff] rounded-2xl border border-[#dbe6f5] hover:border-[#b8d4fa] p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#eef5fe] text-[#1d63ed] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f2445] mb-2 group-hover:text-[#1d63ed] transition-colors">
              Download Results
            </h3>
            <p className="text-xs text-[#5a7191] leading-relaxed">
              Get preprocessed MRI and analysis results
            </p>
          </div>
          <div className="pt-4 flex justify-end text-[#1d63ed]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
