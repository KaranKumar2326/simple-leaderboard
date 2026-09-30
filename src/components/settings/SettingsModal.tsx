import React, { useState } from 'react';
import {
  X,
  Link,
  Sliders,
  Table,
  ShieldAlert,
  CheckCircle,
  Save,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react';
import Papa from 'papaparse';
import { useChampionship } from '../../context/ChampionshipContext';
import { DEFAULT_SETTINGS, type StoredSettings } from '../../services/googleSheetService';
import {
  DEMO_STUDENTS,
  DEMO_TESTS,
  DEMO_TEST_RESULTS,
  DEMO_PRIZES,
} from '../../services/demoData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, issues } = useChampionship();

  const [activeTab, setActiveTab] = useState<'connect' | 'rules' | 'guide' | 'issues'>('connect');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [formData, setFormData] = useState<StoredSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetToDemo = () => {
    setFormData(DEFAULT_SETTINGS);
    updateSettings(DEFAULT_SETTINGS);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSheetIdChange = (val: string) => {
    let cleanId = val.trim();
    const match = cleanId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      cleanId = match[1];
    }
    setFormData((prev) => ({ ...prev, sheetId: cleanId }));
  };

  const copyCsv = (data: any[], tabName: string) => {
    const csv = Papa.unparse(data);
    navigator.clipboard.writeText(csv);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">
              Configuration
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-950 uppercase mt-0.5">
              Championship Settings
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Data source options, Google Sheets connection, and scoring rules.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/30 px-6 gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'connect'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Data Source</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Excel / Sheets Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ranking Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'issues'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Notices ({issues.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-6">

          {/* TAB 1: CONNECT */}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider block mb-2">
                  Select Data Provider
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, sourceType: 'demo' }))}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      formData.sourceType === 'demo'
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-tight text-stone-900">
                        Built-in Season 1 Demo
                      </span>
                      {formData.sourceType === 'demo' && <CheckCircle className="w-4 h-4 text-stone-900" />}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      22 students, 15 tests, complete test logs, and mystery awards.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, sourceType: 'live' }))}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      formData.sourceType === 'live'
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-tight text-stone-900">
                        Live Google Sheet
                      </span>
                      {formData.sourceType === 'live' && <CheckCircle className="w-4 h-4 text-stone-900" />}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Sync from public Google Sheet filled via Google Form submissions.
                    </p>
                  </button>
                </div>
              </div>

              {formData.sourceType === 'live' && (
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
                    <strong className="text-stone-900 block mb-1">Google Sheet Sharing Requirement:</strong>
                    In your Google Sheet, click <strong>Share</strong> and set General Access to <strong>"Anyone with the link can view"</strong>.
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Google Sheet ID or Full URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1QDany--BNFoCEfbBhWJdY_WJInNIPLDNfLV-c44Vg24"
                      value={formData.sheetId}
                      onChange={(e) => handleSheetIdChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] font-mono text-stone-500 block mb-1">Students Tab</label>
                      <input
                        type="text"
                        value={formData.studentsTab}
                        onChange={(e) => setFormData((p) => ({ ...p, studentsTab: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-stone-500 block mb-1">Tests Tab</label>
                      <input
                        type="text"
                        value={formData.testsTab}
                        onChange={(e) => setFormData((p) => ({ ...p, testsTab: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-stone-500 block mb-1">Results Tab</label>
                      <input
                        type="text"
                        value={formData.resultsTab}
                        onChange={(e) => setFormData((p) => ({ ...p, resultsTab: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-stone-500 block mb-1">Prizes Tab</label>
                      <input
                        type="text"
                        value={formData.prizesTab}
                        onChange={(e) => setFormData((p) => ({ ...p, prizesTab: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GUIDE & EXCEL EXPORT */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Excel Download Box */}
              <div className="p-4 rounded-lg border border-stone-200 bg-stone-50/70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
                    <span className="font-bold text-xs uppercase tracking-tight text-stone-900">
                      Pre-built Excel Workbook (.xlsx)
                    </span>
                  </div>
                  <a
                    href="/Tuition_Championship_Data.xlsx"
                    download="Tuition_Championship_Data.xlsx"
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold tracking-wide transition-colors"
                  >
                    Download .xlsx
                  </a>
                </div>
                <p className="text-xs text-stone-600">
                  Contains all 4 worksheets (<strong>STUDENTS</strong>, <strong>TESTS</strong>, <strong>TEST_RESULTS</strong>, <strong>PRIZES</strong>).
                </p>
                <div className="mt-3 p-2.5 bg-white border border-stone-200 rounded text-[11px] text-stone-600">
                  <strong className="text-stone-900">1-Click Google Sheet Import:</strong> Open your Google Sheet → click <strong>File → Import → Upload</strong> → select the downloaded <code className="bg-stone-100 px-1 py-0.5 rounded">Tuition_Championship_Data.xlsx</code> → choose <em>"Replace spreadsheet"</em>. All 4 tabs are created instantly!
                </div>
              </div>

              {/* Copy CSVs */}
              <div>
                <label className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider block mb-2">
                  Or Copy Raw CSV for Individual Tabs
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => copyCsv(DEMO_STUDENTS, 'STUDENTS')}
                    className="p-2.5 border border-stone-200 hover:border-stone-300 rounded text-left text-xs bg-white flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">STUDENTS.csv</span>
                      <span className="text-[10px] text-stone-400">22 records</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {copiedTab === 'STUDENTS' ? 'Copied!' : 'Copy'}
                    </span>
                  </button>

                  <button
                    onClick={() => copyCsv(DEMO_TESTS, 'TESTS')}
                    className="p-2.5 border border-stone-200 hover:border-stone-300 rounded text-left text-xs bg-white flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">TESTS.csv</span>
                      <span className="text-[10px] text-stone-400">15 records</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {copiedTab === 'TESTS' ? 'Copied!' : 'Copy'}
                    </span>
                  </button>

                  <button
                    onClick={() => copyCsv(DEMO_TEST_RESULTS, 'TEST_RESULTS')}
                    className="p-2.5 border border-stone-200 hover:border-stone-300 rounded text-left text-xs bg-white flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">TEST_RESULTS.csv</span>
                      <span className="text-[10px] text-stone-400">250 records</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {copiedTab === 'TEST_RESULTS' ? 'Copied!' : 'Copy'}
                    </span>
                  </button>

                  <button
                    onClick={() => copyCsv(DEMO_PRIZES, 'PRIZES')}
                    className="p-2.5 border border-stone-200 hover:border-stone-300 rounded text-left text-xs bg-white flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">PRIZES.csv</span>
                      <span className="text-[10px] text-stone-400">5 records</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {copiedTab === 'PRIZES' ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Season Target Tests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.championshipTotalTests}
                    onChange={(e) => setFormData((p) => ({ ...p, championshipTotalTests: Number(e.target.value) || 15 }))}
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Streak Threshold (%)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={formData.streakThresholdPercent}
                    onChange={(e) => setFormData((p) => ({ ...p, streakThresholdPercent: Number(e.target.value) || 80 }))}
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ISSUES */}
          {activeTab === 'issues' && (
            <div>
              {issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-900">Zero Data Validation Issues</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">All student rows and scores conform to schema.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {issues.map((iss, i) => (
                    <div key={i} className="p-3 rounded border border-amber-200 bg-amber-50/50 text-xs text-amber-900">
                      <span className="font-mono font-bold mr-2">[{iss.type}]</span>
                      <span>{iss.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={handleResetToDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-700 font-semibold font-mono">
                Saved & Applied!
              </span>
            )}
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
