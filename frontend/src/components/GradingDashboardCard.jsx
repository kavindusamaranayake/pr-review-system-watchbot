/**
 * Dashboard Card for Grading Assistant
 * Add this card to your Dashboard.jsx component
 * to provide quick access to the grading system
 */

import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

// Option 1: Simple Card Link
export const GradingCard = () => (
  <Link 
    to="/grading"
    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-green-100 rounded-lg">
        <Sparkles className="w-6 h-6 text-green-600" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Grading Assistant
    </h3>
    <p className="text-sm text-gray-600">
      Automated grading with AI-powered code analysis for student assignments
    </p>
  </Link>
);

// Option 2: Detailed Card with Stats
export const GradingCardDetailed = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Grading Assistant
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          AI-powered automated grading system
        </p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-green-50 rounded-lg p-3">
        <div className="flex items-center gap-2 text-green-700 text-xs font-semibold mb-1">
          <CheckCircle2 className="w-3 h-3" />
          Structural
        </div>
        <div className="text-lg font-bold text-green-900">100%</div>
        <div className="text-xs text-green-600">Accurate</div>
      </div>
      <div className="bg-purple-50 rounded-lg p-3">
        <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold mb-1">
          <Zap className="w-3 h-3" />
          AI Quality
        </div>
        <div className="text-lg font-bold text-purple-900">GPT-4o</div>
        <div className="text-xs text-purple-600">Powered</div>
      </div>
    </div>
    
    <Link 
      to="/grading"
      className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors"
    >
      Start Grading
    </Link>
  </div>
);

// Option 3: Banner Style
export const GradingBanner = () => (
  <Link 
    to="/grading"
    className="block bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm p-6 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">
            Automated Grading Assistant
          </h3>
          <p className="text-green-50 text-sm">
            Grade student assignments with AI-powered code analysis • 100% Accurate Structure Checks
          </p>
        </div>
      </div>
      <ArrowRight className="w-6 h-6 flex-shrink-0" />
    </div>
  </Link>
);

// Option 4: Compact Button
export const GradingButton = () => (
  <Link 
    to="/grading"
    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
  >
    <Sparkles className="w-4 h-4" />
    Grade Assignments
  </Link>
);

/**
 * USAGE IN DASHBOARD.JSX:
 * 
 * import { GradingCard } from './GradingDashboardCard';
 * 
 * function Dashboard() {
 *   return (
 *     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *       <GradingCard />
 *       {/* Your other dashboard cards *\/}
 *     </div>
 *   );
 * }
 */
