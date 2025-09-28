import OpenAI from 'openai';
import { AIAnalysisResult } from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async analyzeDiagnosticData(
    dataType: 'video' | 'audio' | 'text' | 'obd2',
    data: string | Buffer,
    vehicleInfo?: {
      make: string;
      model: string;
      year: number;
      mileage?: number;
    }
  ): Promise<AIAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(dataType, data, vehicleInfo);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert automotive diagnostic AI. Analyze the provided diagnostic data and identify potential vehicle faults.
            Provide detailed analysis with confidence scores, estimated costs, and repair recommendations.
            Focus on safety-critical issues first, then performance and maintenance items.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const analysis = completion.choices[0]?.message?.content;
      if (!analysis) {
        throw new Error('No analysis generated');
      }

      return this.parseAnalysisResponse(analysis);
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error('Failed to analyze diagnostic data');
    }
  }

  private static buildAnalysisPrompt(
    dataType: string,
    data: string | Buffer,
    vehicleInfo?: any
  ): string {
    const vehicleContext = vehicleInfo
      ? `Vehicle: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}, Mileage: ${vehicleInfo.mileage || 'Unknown'} miles`
      : 'Vehicle information not provided';

    let dataDescription = '';

    switch (dataType) {
      case 'obd2':
        dataDescription = `OBD-II Diagnostic Codes/Data: ${data}`;
        break;
      case 'video':
        dataDescription = 'Video footage of vehicle operation/engine behavior';
        break;
      case 'audio':
        dataDescription = 'Audio recording of vehicle sounds (engine, brakes, etc.)';
        break;
      case 'text':
        dataDescription = `Mechanic's notes: ${data}`;
        break;
      default:
        dataDescription = `Diagnostic data: ${data}`;
    }

    return `
${vehicleContext}

Data Type: ${dataType}
${dataDescription}

Please analyze this diagnostic data and provide:
1. Identified faults with severity levels (low/medium/high/critical)
2. Detailed descriptions of each fault
3. Estimated repair costs (parts + labor)
4. Recommended actions/repairs
5. Confidence level in the analysis (0-1)
6. Estimated repair time in hours

Format your response as a JSON object with this structure:
{
  "faults": [
    {
      "component": "string",
      "severity": "low|medium|high|critical",
      "description": "string",
      "estimatedCost": number,
      "urgency": number (1-10, where 10 is most urgent)
    }
  ],
  "recommendations": ["string"],
  "confidence": number (0-1),
  "estimatedRepairTime": number (hours),
  "totalEstimatedCost": number
}
`;
  }

  private static parseAnalysisResponse(analysis: string): AIAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate the structure
      if (!parsed.faults || !Array.isArray(parsed.faults)) {
        throw new Error('Invalid response structure');
      }

      return {
        faults: parsed.faults.map((fault: any) => ({
          component: fault.component || 'Unknown Component',
          severity: ['low', 'medium', 'high', 'critical'].includes(fault.severity)
            ? fault.severity
            : 'medium',
          description: fault.description || 'No description provided',
          estimatedCost: typeof fault.estimatedCost === 'number' ? fault.estimatedCost : 0,
          urgency: typeof fault.urgency === 'number' ? Math.min(Math.max(fault.urgency, 1), 10) : 5
        })),
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        confidence: typeof parsed.confidence === 'number'
          ? Math.min(Math.max(parsed.confidence, 0), 1)
          : 0.5,
        estimatedRepairTime: typeof parsed.estimatedRepairTime === 'number'
          ? parsed.estimatedRepairTime
          : 1,
        totalEstimatedCost: typeof parsed.totalEstimatedCost === 'number'
          ? parsed.totalEstimatedCost
          : 0
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return a fallback response
      return {
        faults: [{
          component: 'Unknown',
          severity: 'medium' as const,
          description: 'AI analysis completed but results could not be parsed. Manual inspection recommended.',
          estimatedCost: 0,
          urgency: 5
        }],
        recommendations: ['Schedule manual inspection', 'Consult certified mechanic'],
        confidence: 0.3,
        estimatedRepairTime: 1,
        totalEstimatedCost: 0
      };
    }
  }

  static async generatePredictiveInsights(
    vehicleHistory: any[],
    currentMileage: number
  ): Promise<{
    predictions: Array<{
      component: string;
      predictedFailureDate: string;
      confidence: number;
      recommendedAction: string;
    }>;
    overallHealthScore: number;
  }> {
    try {
      const historySummary = vehicleHistory.map(record =>
        `${record.date}: ${record.description} - ${record.partsUsed.join(', ')}`
      ).join('\n');

      const prompt = `
Vehicle History:
${historySummary}

Current Mileage: ${currentMileage}

Based on this maintenance history, predict potential future failures and provide:
1. Components likely to need service soon
2. Estimated timeline for each prediction
3. Confidence in each prediction
4. Recommended preventive actions
5. Overall vehicle health score (0-100)

Format as JSON:
{
  "predictions": [
    {
      "component": "string",
      "predictedFailureDate": "YYYY-MM-DD",
      "confidence": number (0-1),
      "recommendedAction": "string"
    }
  ],
  "overallHealthScore": number (0-100)
}
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert predictive maintenance AI for vehicles. Analyze maintenance history to forecast future failures.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No prediction generated');
      }

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Predictive analysis error:', error);
      return {
        predictions: [],
        overallHealthScore: 75 // Default healthy score
      };
    }
  }
}

