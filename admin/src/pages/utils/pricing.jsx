const calculateActPricing = async (act, selectedCounty, selectedAddress, selectedDate, selectedLineup) => {
  console.log(`🧪 act.costPerMile: ${act.costPerMile}, useCountyTravelFee: ${act.useCountyTravelFee}`);
  console.log(`🗺️ act.countyFees:`, act.countyFees);

  let travelFee = 0; // ✅ Add this line

let smallestLineup = null;

if (selectedLineup && Array.isArray(selectedLineup.bandMembers)) {
  smallestLineup = selectedLineup;
} else {
  smallestLineup = act.lineups?.reduce((min, lineup) => {
    if (!Array.isArray(lineup.bandMembers)) return min;
    if (!min || lineup.bandMembers.length < min.bandMembers.length) return lineup;
    return min;
  }, null);
}

if (!smallestLineup) {
  console.warn(`⚠️ No valid lineup found for ${act.name}`);
  return null;
}

if (!Array.isArray(smallestLineup.bandMembers)) {
  console.warn(`⚠️ Lineup found but bandMembers is not an array:`, smallestLineup);
  return null;
}

  const northernCounties = new Set([
    "ceredigion", "cheshire", "cleveland", "conway", "cumbria", "denbighshire", "derbyshire", "durham",
    "flintshire", "greater manchester", "gwynedd", "herefordshire", "lancashire", "leicestershire",
    "lincolnshire", "merseyside", "north humberside", "north yorkshire", "northumberland",
    "nottinghamshire", "rutland", "shropshire", "south humberside", "south yorkshire",
    "staffordshire", "tyne and wear", "warwickshire", "west midlands", "west yorkshire",
    "worcestershire", "wrexham",
    "rhondda cynon taf", "torfaen", "neath port talbot", "bridgend", "blaenau gwent", "caerphilly",
    "cardiff", "merthyr tydfil", "newport", "aberdeen city", "aberdeenshire", "angus",
    "argyll and bute", "clackmannanshire", "dumfries and galloway", "dundee city", "east ayrshire",
    "east dunbartonshire", "east lothian", "east renfrewshire", "edinburgh", "falkirk", "fife",
    "glasgow", "highland", "inverclyde", "midlothian", "moray", "na h eileanan siar",
    "north ayrshire", "north lanarkshire", "orkney islands", "perth and kinross", "renfrewshire",
    "scottish borders", "shetland islands", "south ayrshire", "south lanarkshire", "stirling",
    "west dunbartonshire", "west lothian"
  ]);
  
  const isNorthernGig = northernCounties.has(selectedCounty?.toLowerCase().trim());

  const bandMembers = act.useDifferentTeamForNorthernGigs && isNorthernGig
    ? act.northernTeam || []
    : smallestLineup.bandMembers || [];

    


    console.log(`🎵 Calculating for ${act.name}`);

    const essentialFees = smallestLineup.bandMembers.flatMap((member) => {
      const baseFee = member.isEssential ? Number(member.fee) || 0 : 0;
      const additionalEssentialFees = (member.additionalRoles || [])
        .filter((role) => role.isEssential)
        .map((role) => Number(role.additionalFee) || 0);
      return [baseFee, ...additionalEssentialFees];
    });

    const fee = essentialFees.reduce((sum, fee) => sum + fee, 0);
    
  const memberPostcodes = bandMembers
  .map(member => member.postCode)
  .filter(Boolean);

  console.log("📍 Member Postcodes:", memberPostcodes);
  console.log(`🧱 All lineups for ${act.name}:`, act.lineups);
  
    if (act.useCountyTravelFee && act.countyFees) {
      const countyKey = selectedCounty.toLowerCase();
      const feePerMember = act.countyFees[countyKey] || 0;
      travelFee = feePerMember * memberPostcodes.length;
    } else if (act.costPerMile > 0) {
      for (const postCode of memberPostcodes) {
        console.log("📡 Sending travel API request for", postCode, selectedAddress, selectedDate);
        const destination = typeof selectedAddress === "string"
          ? selectedAddress
          : selectedAddress?.postcode || selectedAddress?.address || "";

        if (!destination) {
          console.warn(`⚠️ No destination address found for ${member.firstName || 'unknown'}`);
          continue;
        }

        // Log destination before fetch
        console.log("🚚 Fetching travel data:", { origin: postCode, destination, date: selectedDate });
        
        const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
const res = await fetch(`${base}/api/travel/get-travel-data?origin=${encodeURIComponent(postCode)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(selectedDate)}`);

        const data = await res.json();
        const distanceMeters = data?.rows?.[0]?.elements?.[0]?.distance?.value || 0;
        const distanceMiles = distanceMeters / 1609.34;
        travelFee += distanceMiles * act.costPerMile * 25;
      }
    } else {
      for (const member of smallestLineup.bandMembers) {
        const postCode = member.postCode;
        if (!postCode) continue;
        const destination = typeof selectedAddress === "string"
          ? selectedAddress
          : selectedAddress?.postcode || selectedAddress?.address || "";

        if (!destination) {
          console.warn(`⚠️ No destination address found for ${member.firstName || 'unknown'}`);
          continue;
        }

        // Log destination before fetch
        console.log("🚚 Fetching travel data:", { origin: postCode, destination, date: selectedDate });
        const res = await fetch(`/api/travel/get-travel-data?origin=${encodeURIComponent(postCode)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(selectedDate)}`);
        const data = await res.json();
        const outbound = data?.outbound;
        const returnTrip = data?.returnTrip;
        
        console.log(`🧾 Raw outbound data for ${member.firstName || 'unknown'}:`, outbound);
        console.log(`🧾 Raw returnTrip data for ${member.firstName || 'unknown'}:`, returnTrip);
        
        if (!outbound || !returnTrip) {
          console.warn(`⚠️ Skipping ${member.firstName || 'unknown'} – missing outbound or returnTrip data`);
          continue;
        }
        
        const outboundDistance = outbound?.distance?.value;
        const returnDistance = returnTrip?.distance?.value;
        const outboundDuration = outbound?.duration?.value;
        const returnDuration = returnTrip?.duration?.value;
        
        console.log(`📏 outboundDistance:`, outboundDistance);
        console.log(`📏 returnDistance:`, returnDistance);
        console.log(`⏱️ outboundDuration:`, outboundDuration);
        console.log(`⏱️ returnDuration:`, returnDuration);
        console.log(`💰 outboundFare:`, outbound.fare?.value);
        console.log(`💰 returnFare:`, returnTrip.fare?.value);
        
        if (
          typeof outboundDistance !== "number" || 
          typeof returnDistance !== "number" || 
          typeof outboundDuration !== "number" || 
          typeof returnDuration !== "number"
        ) {
          console.warn(`⚠️ Skipping ${member.firstName || 'unknown'} – one or more required values missing`);
          continue;
        }
        
        const totalDistanceMiles = (outboundDistance + returnDistance) / 1609.34;
        const totalDurationHours = (outboundDuration + returnDuration) / 3600;
        
        const fuelFee = totalDistanceMiles * 0.56;
        const timeFee = totalDurationHours * 13.23;
        const lateFee = (returnDuration / 3600) > 1 ? 136 : 0;
        const tollFee = (outbound.fare?.value || 0) + (returnTrip.fare?.value || 0);
        
        travelFee += fuelFee + timeFee + lateFee + tollFee;
      }
    }
    
  
    const totalPrice = Math.ceil((fee + travelFee) / .75);
    // 🧾 Detailed breakdown logging
    console.log(`🧾 PRICING BREAKDOWN for ${act.name}`);
    console.log(`• Essential Fee Total: £${fee.toFixed(2)}`);
    console.log(`• Travel Fee Total: £${travelFee.toFixed(2)}`);
    console.log(`• Margin (25%): £${((fee + travelFee) * 0.25).toFixed(2)}`);
    console.log(`• Final Price: £${totalPrice}`);
    return `${totalPrice}`;
  };
  
  export default calculateActPricing;