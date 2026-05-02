import { NextResponse } from 'next/server';
import { ELECTIONS } from '@/data/elections';

/**
 * Health Check API for automated validation.
 * Verifies that the data layer and core logic are accessible.
 */
export async function GET() {
  try {
    const electionCount = ELECTIONS.length;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.1.0',
      checks: {
        data_layer: electionCount > 0 ? 'ok' : 'error',
        election_data_count: electionCount,
        environment: process.env.NODE_VERSION || 'production'
      }
    });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy', error: error.message }, { status: 500 });
  }
}
