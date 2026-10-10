import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Filter, 
  MessageSquare, 
  Activity, 
  Sparkles, 
  CheckCircle, 
  Plus, 
  Send,
  Zap,
  Info
} from 'lucide-react';
import { 
  WeeklyTrendPoint, 
  DepartmentSummary, 
  SurveyResponse, 
  ManagerAction 
} from '../types';
import { storage, ALL_DEPARTMENTS } from '../services/storage';

interface ManagerDashboardProps {
  onExportPdf: () => void;
  onRefresh: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  onExportPdf,
  onRefresh,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [trendMetric, setTrendMetric] = useState<'sentiment' | 'enps' | 'participation' | 'stress'>('sentiment');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [actionInput, setActionInput] = useState<{ commentId: string; note: string; manager: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const responses = storage.getResponses(selectedDept);
  const trends = storage.getWeeklyTrends(selectedDept);
  const deptSummaries = storage.getDepartmentSummaries();
  const managerActions = storage.getManagerActions();

  const latestTrend = trends[trends.length - 1] || {
    sentimentAvg: 4.2,
    enps: 42,
    participationRate: 88,
    stressAvg: 2.3,
    safetyAvg: 4.4,
    responseCount: 128,
  };

  const prevTrend = trends[trends.length - 2] || latestTrend;
  const sentimentDelta = Math.round((latestTrend.sentimentAvg - prevTrend.sentimentAvg) * 10) / 10;
  const enpsDelta = latestTrend.enps - prevTrend.enps;
  const partDelta = latestTrend.participationRate - prevTrend.participationRate;

  // Filter comments
  const responsesWithComments = responses.filter(r => r.comment && r.comment.length > 5).slice(-8).reverse();

  // Handle Action submission
  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionInput || !actionInput.note.trim()) return;

    storage.addManagerAction({
      commentId: actionInput.commentId,
      responseNote: actionInput.note.trim(),
      managerName: actionInput.manager || 'Leadership Team',
      status: 'planned',
    });

    setActionInput(null);
    onRefresh();
  };

  const handleSimulate = () => {
    storage.simulateLiveResponses(3);
    onRefresh();
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      onExportPdf();
      setIsExporting(false);
    }, 300);
  };

  // SVG Trend Line Chart Coordinates
  const chartHeight = 160;
  const chartWidth = 540;
  const paddingX = 40;
  const paddingY = 24;

  const getMetricValue = (pt: WeeklyTrendPoint) => {
    if (trendMetric === 'sentiment') return pt.sentimentAvg;
    if (trendMetric === 'enps') return pt.enps;
    if (trendMetric === 'participation') return pt.participationRate;
    return pt.stressAvg;
  };

  const minVal = trendMetric === 'sentiment' ? 3.0 : trendMetric === 'enps' ? 10 : trendMetric === 'participation' ? 50 : 1.0;
  const maxVal = trendMetric === 'sentiment' ? 5.0 : trendMetric === 'enps' ? 80 : trendMetric === 'participation' ? 100 : 5.0;

  const points = trends.map((pt, idx) => {
    const x = paddingX + (idx / (trends.length - 1)) * (chartWidth - paddingX * 2);
    const val = getMetricValue(pt);
    const normalizedY = (val - minVal) / (maxVal - minVal);
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y, pt, val };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z` : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Management Intelligence
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Synced
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Real-Time Sentiment & Trends
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments ({deptSummaries.reduce((a, b) => a + b.totalResponses, 0)} responses)</option>
              {ALL_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Simulate Live Activity */}
          <button
            onClick={handleSimulate}
            title="Inject simulated anonymous feedback to test real-time charts"
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Check-In</span>
          </button>

          {/* Export PDF Report */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Export Leadership PDF'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Sentiment */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Sentiment Index</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {latestTrend.sentimentAvg}
            </span>
            <span className="text-xs text-slate-500">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className={`font-semibold tabular-nums ${sentimentDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {sentimentDelta >= 0 ? `+${sentimentDelta}` : sentimentDelta}
            </span>
            <span className="text-slate-500">vs. last month</span>
          </div>
        </div>

        {/* KPI 2: eNPS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Employee eNPS</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              +{latestTrend.enps}
            </span>
            <span className="text-xs text-slate-500">Score</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-emerald-700 font-semibold tabular-nums">+{enpsDelta} pts</span>
            <span className="text-slate-500">Industry Top 10%</span>
          </div>
        </div>

        {/* KPI 3: Participation Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Participation Rate</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {latestTrend.participationRate}%
            </span>
            <span className="text-xs text-slate-500">active squad</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-emerald-700 font-semibold tabular-nums">+{partDelta}%</span>
            <span className="text-slate-500">Gamified retention</span>
          </div>
        </div>

        {/* KPI 4: Psychological Safety */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Psychological Safety</span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {latestTrend.safetyAvg}
            </span>
            <span className="text-xs text-slate-500">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="text-emerald-700 font-semibold">Healthy</span>
            <span>· Candid dialogue</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Trend Chart View */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Historical Sentiment Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Eight-week trajectory (Week 34 to 41) · {selectedDept === 'All' ? 'All Squads' : selectedDept}
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'sentiment', label: 'Sentiment (1-5)' },
              { id: 'enps', label: 'eNPS Score' },
              { id: 'participation', label: 'Participation %' },
              { id: 'stress', label: 'Stress Level' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTrendMetric(tab.id as typeof trendMetric)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  trendMetric === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[560px] relative">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-48 overflow-visible"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + ratio * (chartHeight - paddingY * 2);
                const labelVal = (maxVal - ratio * (maxVal - minVal)).toFixed(trendMetric === 'sentiment' || trendMetric === 'stress' ? 1 : 0);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[9px] fill-slate-400 font-mono tabular-nums"
                    >
                      {labelVal}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              {areaD && (
                <path d={areaD} fill="url(#trendGradient)" />
              )}

              {/* Trend Polyline */}
              <path
                d={pathD}
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredTrendIndex === idx;
                return (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? "#0ea5e9" : "#0f172a"}
                      stroke="#ffffff"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredTrendIndex(idx)}
                      onMouseLeave={() => setHoveredTrendIndex(null)}
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-500 font-medium"
                    >
                      {pt.pt.weekLabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredTrendIndex !== null && points[hoveredTrendIndex] && (
              <div
                className="absolute z-10 bg-slate-900 text-white rounded-lg p-2.5 text-xs shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(points[hoveredTrendIndex].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredTrendIndex].y / chartHeight) * 100 - 8}%`
                }}
              >
                <div className="font-bold text-slate-100 mb-1">
                  {points[hoveredTrendIndex].pt.weekLabel} (Week {points[hoveredTrendIndex].pt.weekNumber})
                </div>
                <div className="space-y-0.5 text-[11px] text-slate-300">
                  <div>Value: <strong className="text-white tabular-nums">{points[hoveredTrendIndex].val}</strong></div>
                  <div>Responses: <span className="tabular-nums">{points[hoveredTrendIndex].pt.responseCount}</span></div>
                  <div>Participation: <span className="tabular-nums">{points[hoveredTrendIndex].pt.participationRate}%</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Department Matrix + Anonymous Voices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Breakdown Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Department Performance Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Participation and sentiment benchmark comparison
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-2.5">Squad</th>
                  <th className="pb-2.5 text-right">Responses</th>
                  <th className="pb-2.5 text-right">Part. %</th>
                  <th className="pb-2.5 text-right">Sentiment</th>
                  <th className="pb-2.5 text-right">eNPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptSummaries.map(d => (
                  <tr key={d.name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      {d.name}
                    </td>
                    <td className="py-3 text-right text-slate-600 tabular-nums">
                      {d.totalResponses} / {d.headcount}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                        d.participationRate >= 85
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {d.participationRate}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900 tabular-nums">
                      {d.sentimentAvg}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-700 tabular-nums">
                      +{d.enps}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-Time Anonymous Voice & Leadership Action Taken Loop */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Anonymous Voices
                </h3>
                <p className="text-xs text-slate-500">
                  Qualitative quotes submitted anonymously with management action tracker
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {responsesWithComments.length} Quotes
              </span>
            </div>

            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {responsesWithComments.map(r => {
                const existingAction = managerActions.find(a => a.commentId === r.id);
                return (
                  <div key={r.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-semibold text-slate-800">{r.department}</span>
                      <span>{new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <p className="text-slate-800 italic">
                      "{r.comment}"
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {r.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Manager Action Note */}
                    {existingAction ? (
                      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                        <div className="flex items-center gap-1.5 font-bold text-[11px] mb-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Action Taken by {existingAction.managerName}:</span>
                        </div>
                        <p className="text-[11px] text-emerald-800">
                          {existingAction.responseNote}
                        </p>
                      </div>
                    ) : actionInput?.commentId === r.id ? (
                      <form onSubmit={handleSaveAction} className="mt-2 p-2 bg-white border border-slate-300 rounded-lg space-y-2">
                        <textarea
                          value={actionInput.note}
                          onChange={(e) => setActionInput({ ...actionInput, note: e.target.value })}
                          placeholder="Announce action plan (e.g., We hear you! We are restructuring standups...)"
                          rows={2}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={actionInput.manager}
                            onChange={(e) => setActionInput({ ...actionInput, manager: e.target.value })}
                            placeholder="Your Name / Title"
                            className="text-[11px] px-2 py-1 border border-slate-200 rounded bg-slate-50"
                          />
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActionInput(null)}
                              className="px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-100 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 text-[11px] font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                            >
                              Post Action
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setActionInput({ commentId: r.id, note: '', manager: 'Leadership Team' })}
                        className="text-[11px] text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1 mt-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Log Leadership Action Response</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
