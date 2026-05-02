/**
 * Server-side API route to safely expose the Google Maps API key at runtime.
 * This bypasses the Next.js NEXT_PUBLIC_ build-time limitation for Cloud Run deployments.
 */
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  return Response.json({ key: apiKey });
}
