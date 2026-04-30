/**
 * @fileoverview Pincode to constituency mapping for VoteWise AI
 * Maps common Indian pincodes to their constituencies
 */

/** @type {Object.<string, {constituency: string, state: string, city: string, boothLat: number, boothLng: number}>} */
export const PINCODE_MAP = {
  // Karnataka
  '560001': { constituency: 'Bangalore South', state: 'Karnataka', city: 'Bangalore', boothLat: 12.9716, boothLng: 77.5946 },
  '560002': { constituency: 'Bangalore Central', state: 'Karnataka', city: 'Bangalore', boothLat: 12.9780, boothLng: 77.6040 },
  '560003': { constituency: 'Bangalore North', state: 'Karnataka', city: 'Bangalore', boothLat: 13.0100, boothLng: 77.5900 },
  '560004': { constituency: 'Bangalore East', state: 'Karnataka', city: 'Bangalore', boothLat: 12.9900, boothLng: 77.6200 },
  '570001': { constituency: 'Mysuru', state: 'Karnataka', city: 'Mysuru', boothLat: 12.2958, boothLng: 76.6394 },
  '580001': { constituency: 'Hubli-Dharwad', state: 'Karnataka', city: 'Hubli', boothLat: 15.3647, boothLng: 75.1240 },
  '575001': { constituency: 'Mangalore', state: 'Karnataka', city: 'Mangalore', boothLat: 12.9141, boothLng: 74.8560 },

  // Tamil Nadu
  '600001': { constituency: 'Chennai North', state: 'Tamil Nadu', city: 'Chennai', boothLat: 13.0827, boothLng: 80.2707 },
  '600002': { constituency: 'Chennai South', state: 'Tamil Nadu', city: 'Chennai', boothLat: 13.0100, boothLng: 80.2650 },
  '600003': { constituency: 'Chennai Central', state: 'Tamil Nadu', city: 'Chennai', boothLat: 13.0780, boothLng: 80.2785 },
  '641001': { constituency: 'Coimbatore North', state: 'Tamil Nadu', city: 'Coimbatore', boothLat: 11.0168, boothLng: 76.9558 },
  '625001': { constituency: 'Madurai East', state: 'Tamil Nadu', city: 'Madurai', boothLat: 9.9252, boothLng: 78.1198 },

  // Maharashtra
  '411001': { constituency: 'Pune', state: 'Maharashtra', city: 'Pune', boothLat: 18.5204, boothLng: 73.8567 },
  '411004': { constituency: 'Pune North', state: 'Maharashtra', city: 'Pune', boothLat: 18.5300, boothLng: 73.8450 },
  '400001': { constituency: 'Mumbai South', state: 'Maharashtra', city: 'Mumbai', boothLat: 18.9400, boothLng: 72.8400 },
  '400002': { constituency: 'Mumbai South Central', state: 'Maharashtra', city: 'Mumbai', boothLat: 18.9600, boothLng: 72.8300 },
  '440001': { constituency: 'Nagpur', state: 'Maharashtra', city: 'Nagpur', boothLat: 21.1458, boothLng: 79.0882 },

  // Delhi
  '110001': { constituency: 'New Delhi', state: 'Delhi', city: 'New Delhi', boothLat: 28.6139, boothLng: 77.2090 },
  '110002': { constituency: 'Delhi East', state: 'Delhi', city: 'New Delhi', boothLat: 28.6200, boothLng: 77.2500 },
  '110003': { constituency: 'Delhi South', state: 'Delhi', city: 'New Delhi', boothLat: 28.5800, boothLng: 77.2000 },

  // Telangana
  '500001': { constituency: 'Secunderabad', state: 'Telangana', city: 'Hyderabad', boothLat: 17.4399, boothLng: 78.4983 },
  '500002': { constituency: 'Hyderabad', state: 'Telangana', city: 'Hyderabad', boothLat: 17.3850, boothLng: 78.4867 },
  '500003': { constituency: 'Jubilee Hills', state: 'Telangana', city: 'Hyderabad', boothLat: 17.4200, boothLng: 78.4100 },

  // West Bengal
  '700001': { constituency: 'Kolkata North', state: 'West Bengal', city: 'Kolkata', boothLat: 22.5726, boothLng: 88.3639 },
  '700002': { constituency: 'Kolkata South', state: 'West Bengal', city: 'Kolkata', boothLat: 22.5400, boothLng: 88.3500 },

  // Gujarat
  '380001': { constituency: 'Ahmedabad East', state: 'Gujarat', city: 'Ahmedabad', boothLat: 23.0225, boothLng: 72.5714 },
  '395001': { constituency: 'Surat', state: 'Gujarat', city: 'Surat', boothLat: 21.1702, boothLng: 72.8311 },

  // Rajasthan
  '302001': { constituency: 'Jaipur', state: 'Rajasthan', city: 'Jaipur', boothLat: 26.9124, boothLng: 75.7873 },
  '313001': { constituency: 'Udaipur', state: 'Rajasthan', city: 'Udaipur', boothLat: 24.5854, boothLng: 73.7125 },

  // Uttar Pradesh
  '226001': { constituency: 'Lucknow', state: 'Uttar Pradesh', city: 'Lucknow', boothLat: 26.8467, boothLng: 80.9462 },
  '208001': { constituency: 'Kanpur', state: 'Uttar Pradesh', city: 'Kanpur', boothLat: 26.4499, boothLng: 80.3319 },
  '282001': { constituency: 'Agra', state: 'Uttar Pradesh', city: 'Agra', boothLat: 27.1767, boothLng: 78.0081 },
};

/**
 * Gets constituency info from pincode
 * @param {string} pincode - 6 digit pincode
 * @returns {Object|null} Constituency info or null if not found
 */
export function getConstituencyByPincode(pincode) {
  return PINCODE_MAP[pincode] || null;
}

/**
 * Gets a default constituency for unknown pincodes
 * @param {string} state - State name
 * @returns {Object} Default constituency info
 */
export function getDefaultConstituency(state) {
  return {
    constituency: `${state} General Constituency`,
    state,
    city: state,
    boothLat: 20.5937,
    boothLng: 78.9629,
  };
}
