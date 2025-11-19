import { useState, useEffect } from 'react';
import { TrendingUp, Clock, DollarSign, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';

// Tooltip component for field definitions
const Tooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block ml-1">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
        type="button"
      >
        <Info className="w-3 h-3 text-slate-600" />
      </button>
      {show && (
        <div className="absolute z-10 w-64 p-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg shadow-lg -top-2 left-6">
          {text}
        </div>
      )}
    </div>
  );
};

export default function CoworkerROICalculator() {
  const [employeeCount, setEmployeeCount] = useState(100);
  const [selectedConnectors, setSelectedConnectors] = useState(['slack', 'notion', 'github']);
  const [industry, setIndustry] = useState('SaaS');
  const [meetingFrequency, setMeetingFrequency] = useState('medium');
  const [searchFrequency, setSearchFrequency] = useState(5);
  const [teamType, setTeamType] = useState('mixed');
  const [showDetails, setShowDetails] = useState(false);
  const [animatedMonthly, setAnimatedMonthly] = useState(0);

  const connectors = [
    { id: 'slack', name: 'Slack', color: 'bg-purple-100 border-purple-300 hover:border-purple-400' },
    { id: 'notion', name: 'Notion', color: 'bg-gray-100 border-gray-300 hover:border-gray-400' },
    { id: 'drive', name: 'Google Drive', color: 'bg-blue-100 border-blue-300 hover:border-blue-400' },
    { id: 'jira', name: 'Jira', color: 'bg-blue-100 border-blue-300 hover:border-blue-400' },
    { id: 'github', name: 'GitHub', color: 'bg-gray-100 border-gray-300 hover:border-gray-400' },
    { id: 'hubspot', name: 'HubSpot', color: 'bg-orange-100 border-orange-300 hover:border-orange-400' },
    { id: 'salesforce', name: 'Salesforce', color: 'bg-blue-100 border-blue-300 hover:border-blue-400' },
    { id: 'snowflake', name: 'Snowflake', color: 'bg-cyan-100 border-cyan-300 hover:border-cyan-400' },
    { id: 'gmail', name: 'Gmail', color: 'bg-red-100 border-red-300 hover:border-red-400' },
    { id: 'zoom', name: 'Zoom/Meet', color: 'bg-indigo-100 border-indigo-300 hover:border-indigo-400' }
  ];

  const toggleConnector = (connectorId: string) => {
    setSelectedConnectors(prev => 
      prev.includes(connectorId) 
        ? prev.filter(id => id !== connectorId)
        : [...prev, connectorId]
    );
  };

  const numApps = selectedConnectors.length;

  const industryRates: { [key: string]: number } = {
    'SaaS': 65,
    'FinTech': 75,
    'E-commerce': 55,
    'Gaming': 60,
    'Healthcare Tech': 70,
    'Other': 60
  };

  const getMinutesPerInteraction = () => {
    let baseMinutes = 8;
    if (teamType === 'engineering') baseMinutes = 9;
    else if (teamType === 'sales') baseMinutes = 7;
    
    // Small connector boost (only 3% per connector above 3)
    if (numApps > 3) {
      const boost = (numApps - 3) * 0.03;
      baseMinutes = baseMinutes * (1 + boost);
    }
    
    return Math.min(10, baseMinutes);
  };

  const getDailyInteractions = () => {
    // searchFrequency is now a direct number from slider (1-15)
    const searches = searchFrequency;
    
    // Meeting frequency adds additional interactions
    const meetings = meetingFrequency === 'low' ? 0.3 : 
                     meetingFrequency === 'medium' ? 0.5 : 0.8;
    
    return searches + meetings;
  };

  const hourlyRate = industryRates[industry];
  const activeUsers = employeeCount;
  const minutesPerInteraction = getMinutesPerInteraction();
  const dailyInteractions = getDailyInteractions();

  const monthlyInteractions = Math.round(activeUsers * dailyInteractions * 22);
  const monthlyMinutes = monthlyInteractions * minutesPerInteraction;
  const monthlyHours = Math.round(monthlyMinutes / 60);
  const monthlyValue = Math.round(monthlyHours * hourlyRate);
  const monthlyCost = activeUsers * 30;
  const monthlyROI = monthlyValue - monthlyCost;

  const annualROI = monthlyROI * 12;
  const roiMultiple = monthlyCost > 0 ? (monthlyValue / monthlyCost) : 0;
  const paybackDays = monthlyCost > 0 ? Math.round((monthlyCost / monthlyROI) * 30) : 0;

  const weeklyMinutesPerUser = dailyInteractions * minutesPerInteraction * 5;
  const weeklyHoursPerUser = (weeklyMinutesPerUser / 60).toFixed(1);
  const annualSavingsPerEmployee = Math.round(annualROI / employeeCount);
  const weeklySavingsPerEmployee = Math.round(annualSavingsPerEmployee / 52);

  useEffect(() => {
    const duration = 600;
    const steps = 30;
    const increment = monthlyROI / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= monthlyROI) {
        setAnimatedMonthly(monthlyROI);
        clearInterval(timer);
      } else {
        setAnimatedMonthly(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [monthlyROI]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
        
        <div className="text-center mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
              ROI Calculator
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2">Based on customer implementation data</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          
          {/* LEFT COLUMN - Inputs */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-200 h-fit">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">Configure Your Inputs</h2>
            <div className="space-y-3 sm:space-y-4">
              
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Industry
                  <Tooltip text="Your industry determines the average hourly rate used in calculations. Different industries have different labor costs, which impacts the dollar value of time saved." />
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none bg-white transition-all text-slate-900"
                >
                  <option>SaaS</option>
                  <option>FinTech</option>
                  <option>E-commerce</option>
                  <option>Gaming</option>
                  <option>Healthcare Tech</option>
                  <option>Other</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Hourly rate: ${hourlyRate}/hr</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Number of employees</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    style={{
                      background: `linear-gradient(to right, #2DD4A3 0%, #2DD4A3 ${((employeeCount - 10) / 990) * 100}%, #e2e8f0 ${((employeeCount - 10) / 990) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                  <span className="text-lg font-semibold text-slate-900 min-w-[50px] text-right">{employeeCount}</span>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Primary team type
                  <Tooltip text="Different teams have different work patterns. Engineering teams typically spend more time on technical searches and documentation, while sales teams focus on customer information. This affects the average time saved per interaction." />
                </label>
                <select
                  value={teamType}
                  onChange={(e) => setTeamType(e.target.value)}
                  className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none bg-white transition-all text-slate-900"
                >
                  <option value="mixed">Mixed teams</option>
                  <option value="engineering">Engineering</option>
                  <option value="sales-cs">Customer Success</option>
                  <option value="sales">Sales</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Impacts time saved per interaction</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">How many AI searches per day</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={searchFrequency}
                    onChange={(e) => setSearchFrequency(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    style={{
                      background: `linear-gradient(to right, #2DD4A3 0%, #2DD4A3 ${((searchFrequency - 1) / 14) * 100}%, #e2e8f0 ${((searchFrequency - 1) / 14) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                  <span className="text-lg font-semibold text-slate-900 min-w-[50px] text-right">{searchFrequency}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Primary driver of ROI calculation</p>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Connectors ({numApps} selected)
                  <Tooltip text="More connected apps means Coworker can search across more of your company's knowledge. Each additional connector increases the breadth of information available and slightly increases time saved per search." />
                </label>
                <div className="border border-slate-200 rounded-lg p-3 bg-white">
                  <div className="grid grid-cols-2 gap-2">
                    {connectors.map(connector => (
                      <label key={connector.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedConnectors.includes(connector.id)}
                          onChange={() => toggleConnector(connector.id)}
                          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-900">{connector.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Meeting frequency</label>
                <select
                  value={meetingFrequency}
                  onChange={(e) => setMeetingFrequency(e.target.value)}
                  className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none bg-white transition-all text-slate-900"
                >
                  <option value="low">Low (1-2/day)</option>
                  <option value="medium">Medium (4-6/day)</option>
                  <option value="high">High (8+/day)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Adds meeting-related interactions to daily usage</p>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN - ROI Display */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-200 h-fit lg:sticky lg:top-4">
            <div className="text-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100">
              <div className="text-xs sm:text-sm font-medium text-slate-600 mb-2">NET MONTHLY ROI</div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-2">
                {formatCurrency(animatedMonthly)}
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-emerald-600">{formatCurrency(annualROI)}/year</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {formatCurrency(monthlyValue)} value - {formatCurrency(monthlyCost)} cost
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg mb-1 sm:mb-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{roiMultiple.toFixed(1)}x</div>
                <div className="text-[10px] sm:text-xs text-slate-600">ROI Multiple</div>
              </div>

              <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg mb-1 sm:mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{paybackDays}</div>
                <div className="text-[10px] sm:text-xs text-slate-600">Days to Payback</div>
              </div>

              <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg mb-1 sm:mb-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{activeUsers}</div>
                <div className="text-[10px] sm:text-xs text-slate-600">Active Users</div>
              </div>

              <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg mb-1 sm:mb-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{weeklyHoursPerUser}</div>
                <div className="text-[10px] sm:text-xs text-slate-600">Hrs/Week per User</div>
              </div>
            </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-100 mb-3 sm:mb-4">
            <h3 className="font-semibold text-slate-900 mb-2 sm:mb-3 text-center text-sm sm:text-base">Monthly Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-emerald-100">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">Total Interactions</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">{formatNumber(monthlyInteractions)}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1">{dailyInteractions.toFixed(1)}/user/day</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-emerald-100">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">Time Saved</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">{minutesPerInteraction.toFixed(1)} min</div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1">Per interaction</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-emerald-100">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">Hours Saved</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">{formatNumber(monthlyHours)}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1">Monthly total</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-emerald-100">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">Per Employee</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">{formatCurrency(weeklySavingsPerEmployee)}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1">Weekly savings</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 mb-3 sm:mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-around gap-3 sm:gap-4 text-center">
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">Hourly Rate</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">${hourlyRate}/hr</div>
                <div className="text-[10px] sm:text-xs text-slate-500">{industry} average</div>
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">Coworker Cost</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">{formatCurrency(monthlyCost)}/mo</div>
                <div className="text-[10px] sm:text-xs text-slate-500">$30/user × {activeUsers} users</div>
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">Annual Savings</div>
                <div className="text-lg sm:text-xl font-bold text-emerald-600">{formatCurrency(annualSavingsPerEmployee)}</div>
                <div className="text-[10px] sm:text-xs text-slate-500">Per employee/year</div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">How is this calculated?</h3>
            {showDetails ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />}
          </button>

          {showDetails && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
              <div className="bg-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-100">
                <div className="text-xs sm:text-sm text-slate-700 space-y-2">
                  <p><strong>Active Users:</strong> {employeeCount} employees = {activeUsers} users</p>
                  
                  <p className="pt-2"><strong>Daily Interactions:</strong> {dailyInteractions.toFixed(1)} per user/day</p>
                  <p className="text-xs text-slate-500">({searchFrequency} AI searches + {(dailyInteractions - searchFrequency).toFixed(1)} meeting-related interactions)</p>
                  
                  <p className="pt-2"><strong>Monthly Interactions:</strong> {activeUsers} users × {dailyInteractions.toFixed(1)} interactions × 22 workdays = {formatNumber(monthlyInteractions)}</p>
                  
                  <p className="pt-2"><strong>Time Saved:</strong> {formatNumber(monthlyInteractions)} interactions × {minutesPerInteraction.toFixed(1)} min = {formatNumber(monthlyMinutes)} min ({formatNumber(monthlyHours)} hours)</p>
                  <p className="text-xs text-slate-500">({minutesPerInteraction.toFixed(1)} minutes saved per interaction based on {numApps} connected apps and {teamType} team type)</p>
                  
                  <p className="pt-2"><strong>Dollar Value:</strong> {formatNumber(monthlyHours)} hours × ${hourlyRate}/hour = {formatCurrency(monthlyValue)}</p>
                  <p className="text-xs text-slate-500">(Using {industry} industry average hourly rate)</p>
                  
                  <p className="pt-3 border-t border-emerald-200"><strong>Net ROI:</strong> {formatCurrency(monthlyValue)} - {formatCurrency(monthlyCost)} cost = <span className="text-emerald-700 font-bold">{formatCurrency(monthlyROI)}/month</span></p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <p><strong>{formatCurrency(weeklySavingsPerEmployee)}/week per employee</strong> in time savings is very realistic - that's just {weeklyHoursPerUser} hours/week.</p>
                  <p><strong>{minutesPerInteraction.toFixed(1)} minutes saved</strong> per interaction is a conservative estimate based on actual customer data.</p>
                  <p><strong>{dailyInteractions.toFixed(1)} interactions/day</strong> is reasonable usage - not assuming everyone uses it constantly.</p>
                  <p className="pt-1 text-emerald-700 font-semibold">Even with these conservative assumptions, you get a {roiMultiple.toFixed(1)}x return on investment.</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200">
                <p className="font-semibold text-slate-900 mb-2 text-xs sm:text-sm">Your Results May Vary</p>
                <p className="text-xs sm:text-sm text-slate-700">
                  These calculations use conservative industry benchmarks. Many teams see greater time savings (10-15 min per interaction) as Coworker becomes integrated into daily workflows. We prefer to under-promise and over-deliver.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}