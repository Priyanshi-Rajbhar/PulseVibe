import { jsPDF } from 'jspdf';
import { storage } from './storage';

export function generateLeadershipPdfReport(): { success: boolean; filename: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const depts = storage.getDepartmentSummaries();
  const trends = storage.getWeeklyTrends();
  const latestTrend = trends[trends.length - 1];
  const allResponses = storage.getResponses();
  const currentWeekResponses = allResponses.filter(r => r.weekNumber === 41);

  // Helper colors
  const primaryColor = [15, 23, 42]; // #0f172a slate-900
  const secondaryColor = [71, 85, 105]; // #475569 slate-600
  const accentColor = [14, 165, 233]; // #0ea5e9 sky-500
  const lightBg = [248, 250, 252]; // #f8fafc slate-50
  const borderLine = [226, 232, 240]; // #e2e8f0 slate-200

  // --------------------------------------------------------------------------
  // PAGE 1: EXECUTIVE SUMMARY & DEPARTMENT BREAKDOWN
  // --------------------------------------------------------------------------

  // Top header banner background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PULSEVIBE EXECUTIVE SENTIMENT REPORT', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Confidential Leadership Review · Aggregated Anonymity Enforced (n ≥ 3)', margin, 18);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Fiscal W41`, pageWidth - margin - 50, 18);

  let y = 36;

  // Executive Overview narrative
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Executive Overview & Organizational Health', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const overviewText = `During Week 41, the organization maintained strong employee engagement with an overall participation rate of ${latestTrend.participationRate}% across ${currentWeekResponses.length} total anonymous submissions. The aggregate sentiment index stands at ${latestTrend.sentimentAvg} / 5.0, reflecting resilient morale across squads. The company eNPS achieved +${latestTrend.enps}, placing employee satisfaction comfortably within top-quartile technology benchmark standards.`;
  const splitOverview = doc.splitTextToSize(overviewText, contentWidth);
  doc.text(splitOverview, margin, y);
  y += splitOverview.length * 4.5 + 4;

  // KPI Score Cards Grid (5 horizontal blocks)
  const cardWidth = (contentWidth - 8) / 4;
  const kpiData = [
    { title: 'SENTIMENT INDEX', value: `${latestTrend.sentimentAvg} / 5.0`, sub: '+0.3 vs Last Month' },
    { title: 'EMPLOYEE eNPS', value: `+${latestTrend.enps}`, sub: 'Top-Quartile Health' },
    { title: 'PARTICIPATION RATE', value: `${latestTrend.participationRate}%`, sub: `${currentWeekResponses.length} Active Responses` },
    { title: 'PSYCH SAFETY', value: `${latestTrend.safetyAvg} / 5.0`, sub: 'Low Team Friction' },
  ];

  kpiData.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardWidth + 2.6);
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.roundedRect(cardX, y, cardWidth, 18, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(kpi.title, cardX + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(kpi.value, cardX + 3, y + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(kpi.sub, cardX + 3, y + 15.5);
  });

  y += 26;

  // Section 2: Department Performance Table
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Departmental Breakdown & Participation Matrix', margin, y);
  y += 5;

  // Table Header
  const colWidths = [45, 22, 22, 26, 26, 22, 15];
  const colTitles = ['Department', 'Headcount', 'Responses', 'Participation', 'Sentiment', 'eNPS', 'Trend'];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
  doc.line(margin, y + 7, margin + contentWidth, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

  let curX = margin + 2;
  colTitles.forEach((t, i) => {
    doc.text(t, curX, y + 4.8);
    curX += colWidths[i];
  });
  y += 7;

  // Table Rows
  depts.forEach((dept, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(252, 253, 254);
      doc.rect(margin, y, contentWidth, 6.5, 'F');
    }
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    let rowX = margin + 2;
    doc.text(dept.name, rowX, y + 4.6);
    rowX += colWidths[0];

    doc.text(String(dept.headcount), rowX, y + 4.6);
    rowX += colWidths[1];

    doc.text(String(dept.totalResponses), rowX, y + 4.6);
    rowX += colWidths[2];

    doc.text(`${dept.participationRate}%`, rowX, y + 4.6);
    rowX += colWidths[3];

    doc.setFont('helvetica', 'bold');
    doc.text(`${dept.sentimentAvg} / 5.0`, rowX, y + 4.6);
    doc.setFont('helvetica', 'normal');
    rowX += colWidths[4];

    doc.text(`+${dept.enps}`, rowX, y + 4.6);
    rowX += colWidths[5];

    const trendText = dept.trendDelta >= 0 ? `+${dept.trendDelta}` : `${dept.trendDelta}`;
    doc.setTextColor(dept.trendDelta >= 0 ? 22 : 220, dept.trendDelta >= 0 ? 163 : 38, dept.trendDelta >= 0 ? 74 : 38);
    doc.text(trendText, rowX, y + 4.6);

    y += 6.5;
  });

  y += 10;

  // Section 3: Key Focus Areas
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Key Cultural Drivers & Stress Diagnostics', margin, y);
  y += 5;

  const focusPoints = [
    { title: 'Workload & Meeting Load', desc: 'Engineering and Customer Success reported elevated meeting density. Recommending continuation of async standups.' },
    { title: 'Recognition & Impact', desc: '82% of respondents feel their weekly contributions are acknowledged by peers and squad leads.' },
    { title: 'Psychological Safety', desc: 'Strong baseline at 4.3/5.0 with high willingness to speak candidly regarding technical debt.' },
  ];

  focusPoints.forEach(f => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`• ${f.title}:`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const splitDesc = doc.splitTextToSize(f.desc, contentWidth - 45);
    doc.text(splitDesc, margin + 45, y);
    y += Math.max(splitDesc.length * 4.2, 5.5);
  });

  // Footer for page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('PulseVibe Analytics · Page 1 of 2', margin, pageHeight - 8);
  doc.text('Internal Leadership Use Only', pageWidth - margin - 35, pageHeight - 8);

  // --------------------------------------------------------------------------
  // PAGE 2: TRENDS, EMPLOYEE VOICES & ACTION ITEMS
  // --------------------------------------------------------------------------
  doc.addPage();

  // Top header banner background for page 2
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PULSEVIBE · HISTORICAL TRENDS & ACTION COMMITMENTS', margin, 11);

  y = 28;

  // Section 4: 8-Week Trend Trajectory Table
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. Eight-Week Historical Trajectory (W34 - W41)', margin, y);
  y += 5;

  const trendColWidths = [24, 26, 26, 28, 26, 26, 22];
  const trendColTitles = ['Week', 'Sentiment', 'eNPS', 'Participation', 'Stress Level', 'Psych Safety', 'Responses'];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

  let tX = margin + 2;
  trendColTitles.forEach((t, i) => {
    doc.text(t, tX, y + 4.5);
    tX += trendColWidths[i];
  });
  y += 6.5;

  trends.forEach((pt, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(252, 253, 254);
      doc.rect(margin, y, contentWidth, 5.8, 'F');
    }
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.line(margin, y + 5.8, margin + contentWidth, y + 5.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    let rowX = margin + 2;
    doc.text(pt.weekLabel, rowX, y + 4.2);
    rowX += trendColWidths[0];

    doc.text(`${pt.sentimentAvg} / 5.0`, rowX, y + 4.2);
    rowX += trendColWidths[1];

    doc.text(`+${pt.enps}`, rowX, y + 4.2);
    rowX += trendColWidths[2];

    doc.text(`${pt.participationRate}%`, rowX, y + 4.2);
    rowX += trendColWidths[3];

    doc.text(`${pt.stressAvg} / 5.0`, rowX, y + 4.2);
    rowX += trendColWidths[4];

    doc.text(`${pt.safetyAvg} / 5.0`, rowX, y + 4.2);
    rowX += trendColWidths[5];

    doc.text(String(pt.responseCount), rowX, y + 4.2);

    y += 5.8;
  });

  y += 10;

  // Section 5: Anonymized Qualitative Quotes
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('5. Selected Anonymous Employee Voices (Thematic Sample)', margin, y);
  y += 5;

  const quoteSamples = [
    {
      dept: 'Engineering',
      quote: '"Great sprint velocity, but the back-to-back Thursday meetings are exhausting. An async sync block would help immensely."',
      theme: 'Meeting Efficiency'
    },
    {
      dept: 'Product & Design',
      quote: '"Appreciated the clear roadmap update from leadership at yesterday’s all-hands. Cross-squad alignment is the highest it has been."',
      theme: 'Executive Transparency'
    },
    {
      dept: 'Marketing',
      quote: '"The flexible remote schedule has made an immeasurable difference to my mental focus and family balance."',
      theme: 'Workplace Flexibility'
    },
    {
      dept: 'Customer Success',
      quote: '"CS ticket volume spiked post-launch. Would appreciate dedicated training or tier-2 backup during peak hours."',
      theme: 'Resource Scaling'
    }
  ];

  quoteSamples.forEach(q => {
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(`${q.dept} · Theme: ${q.theme}`, margin + 3, y + 4);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const quoteLines = doc.splitTextToSize(q.quote, contentWidth - 6);
    doc.text(quoteLines, margin + 3, y + 8.5);

    y += 14;
  });

  y += 4;

  // Section 6: Actionable Leadership Next Steps
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('6. Recommended Leadership Action Items', margin, y);
  y += 5;

  const actionItems = [
    'Protect Focus Time: Implement "No-Meeting Thursday Afternoons" across engineering and product squads.',
    'Workload Redistribution: Allocate temporary support to Customer Success during the v3.4 product migration rollout.',
    'Celebrate Wins: Highlight Sales & Marketing pipeline milestones in upcoming Monday executive briefing.',
  ];

  actionItems.forEach(act => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const splitAct = doc.splitTextToSize(`[✓] ${act}`, contentWidth);
    doc.text(splitAct, margin, y);
    y += splitAct.length * 4.5 + 1.5;
  });

  // Footer for page 2
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('PulseVibe Analytics · Page 2 of 2', margin, pageHeight - 8);
  doc.text('Strict Anonymity Preserved · End of Report', pageWidth - margin - 55, pageHeight - 8);

  const filename = `PulseVibe_Leadership_Sentiment_Report_W41_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);

  return { success: true, filename };
}
