
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStadiumData = async (query: string, context: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are an expert Stadium Operations AI assistant for FIFA-grade facilities.
        
        Current Stadium Context:
        - Readiness Score: ${context.readinessScore}%
        - Turf Health Avg: ${context.turfHealth}%
        - Active Alerts: ${context.activeAlerts}
        - Pitch Distribution: ${JSON.stringify(context.distribution)}
        
        User Query: ${query}
        
        Provide professional, actionable advice based on international standards (FIFA/UEFA).
        Keep the response concise and formatted with markdown.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating AI insights.";
  }
};

export const generateReadinessReport = async (stats: any) => {
  const prompt = `
    Generate a formal "FIFA/UEFA Stadium Compliance Report" for the current facility status.
    Stats:
    - Pitch Quality: ${stats.turfHealth}%
    - Lighting/Infrastructure: ${stats.infraScore}%
    - Safety Compliance: ${stats.safetyScore}%
    - Financial Margin: ${stats.margin}%
    
    Structure as a formal audit result. Include:
    1. Certification Level (e.g., FIFA Quality Pro).
    2. Critical Remediation List.
    3. Broadcast Readiness Statement.
    
    Be authoritative and detailed. Use Markdown.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Report generation timed out.";
  }
};

export const calculateIrrigationNeeds = async (moistureData: number[], forecast: string) => {
  const avgMoisture = moistureData.reduce((a, b) => a + b, 0) / moistureData.length;
  const prompt = `
    Analyze soccer pitch irrigation needs.
    Current Data:
    - Avg Moisture: ${avgMoisture.toFixed(1)}%
    - Forecast: ${forecast}
    
    Suggest a 24h cycle focusing on professional playability. Include Timing, Volume, and Evapotranspiration factors.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Hydraulic analysis failed.";
  }
};

export const getFinancialInsights = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze stadium ROI:
        - Revenue: $${stats.revenue}
        - Operational Costs: $${stats.costs}
        - Attendance: ${stats.attendance}
        
        Identify 3 high-impact cost reduction areas and suggest a premium seat upselling strategy.
      `,
    });
    return response.text;
  } catch (error) {
    return "Financial strategy unavailable.";
  }
};

export const getZoneRemediation = async (zone: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Expert Turf Consultant Prompt:
        Zone ID: ${zone.id}
        Telemetry Data:
        - Moisture: ${zone.moisture}%
        - Density: ${zone.density}%
        - Temperature: ${zone.temperature}°C
        - Health Status: ${zone.status}

        Provide a precise remediation protocol for this specific 5x5m pitch area. 
        Focus on:
        1. Soil aeration requirements.
        2. Fertilizer/Nutrient adjustment (N-P-K).
        3. Recovery timeframe.
        Reference UEFA Pitch Quality Guidelines. Keep it brief and actionable.
      `,
    });
    return response.text;
  } catch (error) {
    return "Remediation intelligence offline.";
  }
};

export const generateMediaReport = async (period: 'weekly' | 'monthly', matchName: string, stats: any) => {
  const prompt = `
    Generate a professional pre-match media briefing for a football match.
    Target: Satellite Sports Channels, Digital Media, Broadcasters.
    Period: ${period} report.
    Upcoming Match: ${matchName}
    
    Data Context:
    - Stadium Compliance: ${stats.compliance}%
    - Turf Surface Health: ${stats.turf}%
    - Facility Readiness: High
    - Expected Attendance: ${stats.attendance.toLocaleString()}
    
    Structure the report for a broadcast audience:
    1. Technical Pitch Analysis (Playability, speed, surface consistency).
    2. Facility Readiness (Floodlights, VAR sync, safety).
    3. Media Logistics (Broadcast camera positioning status, signal integrity).
    4. Matchday Forecast integration.
    
    Use a tone that is professional, confident, and "TV ready". Use Markdown.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Media report generation failed.";
  }
};
