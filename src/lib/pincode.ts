export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  district?: string | undefined;
  area?: string | undefined;
}

// Fast local fallback dictionary for common Indian PIN codes
const COMMON_PINCODES: Record<string, { city: string; state: string; district?: string | undefined }> = {
  // Maharashtra
  '400001': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai' },
  '400050': { city: 'Mumbai', state: 'Maharashtra', district: 'Bandra' },
  '400076': { city: 'Mumbai', state: 'Maharashtra', district: 'Powai' },
  '411001': { city: 'Pune', state: 'Maharashtra', district: 'Pune' },
  '411038': { city: 'Pune', state: 'Maharashtra', district: 'Kothrud' },
  '440001': { city: 'Nagpur', state: 'Maharashtra', district: 'Nagpur' },
  '442302': { city: 'Pulgaon', state: 'Maharashtra', district: 'Wardha' },
  '442001': { city: 'Wardha', state: 'Maharashtra', district: 'Wardha' },
  '431001': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', district: 'Aurangabad' },
  '422001': { city: 'Nashik', state: 'Maharashtra', district: 'Nashik' },
  '416001': { city: 'Kolhapur', state: 'Maharashtra', district: 'Kolhapur' },
  '400601': { city: 'Thane', state: 'Maharashtra', district: 'Thane' },
  '400703': { city: 'Navi Mumbai', state: 'Maharashtra', district: 'Thane' },

  // Delhi NCR
  '110001': { city: 'New Delhi', state: 'Delhi', district: 'Central Delhi' },
  '110017': { city: 'New Delhi', state: 'Delhi', district: 'South Delhi' },
  '110020': { city: 'New Delhi', state: 'Delhi', district: 'Okhla' },
  '122001': { city: 'Gurugram', state: 'Haryana', district: 'Gurugram' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar' },

  // Karnataka
  '560001': { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
  '560038': { city: 'Bengaluru', state: 'Karnataka', district: 'Indiranagar' },
  '560100': { city: 'Bengaluru', state: 'Karnataka', district: 'Electronic City' },
  '570001': { city: 'Mysuru', state: 'Karnataka', district: 'Mysuru' },

  // Telangana & Andhra Pradesh
  '500001': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
  '500081': { city: 'Hyderabad', state: 'Telangana', district: 'HITEC City' },
  '530001': { city: 'Visakhapatnam', state: 'Andhra Pradesh', district: 'Visakhapatnam' },

  // Tamil Nadu
  '600001': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
  '641001': { city: 'Coimbatore', state: 'Tamil Nadu', district: 'Coimbatore' },

  // West Bengal
  '700001': { city: 'Kolkata', state: 'West Bengal', district: 'Kolkata' },

  // Gujarat
  '380001': { city: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad' },
  '395001': { city: 'Surat', state: 'Gujarat', district: 'Surat' },
  '390001': { city: 'Vadodara', state: 'Gujarat', district: 'Vadodara' },

  // Rajasthan
  '302001': { city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur' },
  '342001': { city: 'Jodhpur', state: 'Rajasthan', district: 'Jodhpur' },
  '313001': { city: 'Udaipur', state: 'Rajasthan', district: 'Udaipur' },

  // Kerala
  '682001': { city: 'Kochi', state: 'Kerala', district: 'Ernakulam' },
  '695001': { city: 'Thiruvananthapuram', state: 'Kerala', district: 'Thiruvananthapuram' },
};

/**
 * Automatically detects City and State from a 6-digit Indian PIN Code.
 * Queries postalpincode.in API with instant local dictionary fallback.
 */
export async function lookupPincode(pincode: string): Promise<PincodeInfo | null> {
  const cleanPin = pincode.replace(/\D/g, '').trim();
  if (cleanPin.length !== 6) return null;

  // 1. Check local instant dictionary first
  const local = COMMON_PINCODES[cleanPin];
  if (local) {
    return {
      pincode: cleanPin,
      city: local.city,
      state: local.state,
      district: local.district,
    };
  }

  // 2. Fetch from official India Postal API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const city = po.District || po.Block || po.Circle || 'India';
        const state = po.State || 'India';
        return {
          pincode: cleanPin,
          city,
          state,
          district: po.District,
          area: po.Name,
        };
      }
    }
  } catch (err) {
    // If network fails or timeout, use regional prefix heuristics
    console.warn('Pincode network fetch failed, using fallback heuristic', err);
  }

  // 3. Fallback: Region heuristics by first 2 digits
  const prefix = cleanPin.substring(0, 2);
  const regionMap: Record<string, { city: string; state: string }> = {
    '11': { city: 'Delhi', state: 'Delhi' },
    '12': { city: 'Haryana Area', state: 'Haryana' },
    '13': { city: 'Haryana Area', state: 'Haryana' },
    '14': { city: 'Punjab Area', state: 'Punjab' },
    '15': { city: 'Punjab Area', state: 'Punjab' },
    '16': { city: 'Chandigarh Area', state: 'Chandigarh' },
    '17': { city: 'Himachal Area', state: 'Himachal Pradesh' },
    '18': { city: 'Jammu Area', state: 'Jammu & Kashmir' },
    '19': { city: 'Kashmir Area', state: 'Jammu & Kashmir' },
    '20': { city: 'Western UP', state: 'Uttar Pradesh' },
    '21': { city: 'UP Area', state: 'Uttar Pradesh' },
    '22': { city: 'Lucknow Area', state: 'Uttar Pradesh' },
    '24': { city: 'Uttarakhand Area', state: 'Uttarakhand' },
    '26': { city: 'Uttarakhand Area', state: 'Uttarakhand' },
    '30': { city: 'Jaipur Area', state: 'Rajasthan' },
    '31': { city: 'Udaipur Area', state: 'Rajasthan' },
    '32': { city: 'Kota Area', state: 'Rajasthan' },
    '33': { city: 'Bikaner Area', state: 'Rajasthan' },
    '34': { city: 'Jodhpur Area', state: 'Rajasthan' },
    '36': { city: 'Gujarat Area', state: 'Gujarat' },
    '38': { city: 'Ahmedabad Area', state: 'Gujarat' },
    '39': { city: 'Surat Area', state: 'Gujarat' },
    '40': { city: 'Mumbai Area', state: 'Maharashtra' },
    '41': { city: 'Pune Area', state: 'Maharashtra' },
    '42': { city: 'Nashik Area', state: 'Maharashtra' },
    '43': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra' },
    '44': { city: 'Nagpur / Vidarbha', state: 'Maharashtra' },
    '45': { city: 'Indore Area', state: 'Madhya Pradesh' },
    '46': { city: 'Bhopal Area', state: 'Madhya Pradesh' },
    '50': { city: 'Hyderabad Area', state: 'Telangana' },
    '51': { city: 'Andhra Area', state: 'Andhra Pradesh' },
    '52': { city: 'Vijayawada Area', state: 'Andhra Pradesh' },
    '53': { city: 'Visakhapatnam Area', state: 'Andhra Pradesh' },
    '56': { city: 'Bengaluru Area', state: 'Karnataka' },
    '57': { city: 'Mysuru Area', state: 'Karnataka' },
    '58': { city: 'Hubli Area', state: 'Karnataka' },
    '60': { city: 'Chennai Area', state: 'Tamil Nadu' },
    '64': { city: 'Coimbatore Area', state: 'Tamil Nadu' },
    '68': { city: 'Kochi Area', state: 'Kerala' },
    '69': { city: 'Thiruvananthapuram', state: 'Kerala' },
    '70': { city: 'Kolkata Area', state: 'West Bengal' },
  };

  const region = regionMap[prefix];
  if (region) {
    return {
      pincode: cleanPin,
      city: region.city,
      state: region.state,
    };
  }

  return null;
}
