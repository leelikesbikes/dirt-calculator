import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const inputs = await request.json();
    
    // Parse inputs
    const proportionType = inputs.proportionType || 'Average';
    const riderHeight = parseFloat(inputs.riderHeight) || 0;
    const providedHeight = parseFloat(inputs.providedHeight) || 0;
    const providedRAD = parseFloat(inputs.providedRAD) || 0;
    const providedInseam = parseFloat(inputs.providedInseam) || 0;
    const headAngle = parseFloat(inputs.headAngle) || 0;
    const reach = parseFloat(inputs.reach) || 0;
    const stack = parseFloat(inputs.stack) || 0;
    const seatAngle = parseFloat(inputs.seatAngle) || 0;
    const handlebarSetback = parseFloat(inputs.handlebarSetback) || 0;
    const handlebarRise = parseFloat(inputs.handlebarRise) || 0;
    const stemLength = parseFloat(inputs.stemLength) || 0;
    const stemAngle = parseFloat(inputs.stemAngle) || 0;
    const stemHeight = parseFloat(inputs.stemHeight) || 0;
    const spacers = parseFloat(inputs.spacers) || 0;
    const topCap = parseFloat(inputs.topCap) || 0;
    const crankLength = parseFloat(inputs.crankLength) || 0;
    const pedalThickness = parseFloat(inputs.pedalThickness) || 0;

    // PROPRIETARY CALCULATIONS - Hidden from client
    const calculatedRAD = riderHeight * 0.447;
    const calculatedInseam = riderHeight * 0.46;
    
    // Use appropriate values based on proportion type
    const finalHeight = proportionType === 'Average' ? riderHeight : providedHeight;
    const finalRAD = proportionType === 'Average' ? calculatedRAD : providedRAD;
    const finalInseam = proportionType === 'Average' ? calculatedInseam : providedInseam;
    
    console.log('API Calculation:', {
      proportionType,
      riderHeight,
      providedHeight,
      finalHeight,
      finalRAD,
      finalInseam
    });
    
    const armLength = 0.393 * finalHeight;
    const torsoLength = 0.347 * finalHeight;
    const torsoMass = 58;
    const armMass = 10;

    const saddleHeight = (finalInseam * 1.09) - crankLength + (pedalThickness * 0.5);
    const seatAngleRad = (seatAngle * Math.PI) / 180;
    const seatPosReach = saddleHeight * Math.cos(seatAngleRad);
    const seatPosStack = saddleHeight * Math.sin(seatAngleRad);
    
    const headAngleRad = (headAngle * Math.PI) / 180;
    const halfStack = topCap + spacers + (stemHeight * 0.5);
    const halfStackReach = halfStack * Math.cos(headAngleRad) * -1;
    const halfStackStack = halfStack * Math.sin(headAngleRad);
    
    const effectiveStemAngle = 90 - headAngle + stemAngle;
    const effectiveStemAngleRad = (effectiveStemAngle * Math.PI) / 180;
    const stemReach = stemLength * Math.cos(effectiveStemAngleRad);
    const stemStack = stemLength * Math.sin(effectiveStemAngleRad);
    
    const radTotalReach = reach + halfStackReach + stemReach - handlebarSetback;
    const radTotalStack = stack + halfStackStack + stemStack + handlebarRise;
    const radLength = Math.sqrt((radTotalReach ** 2) + (radTotalStack ** 2));
    const radAngle = 90 - (Math.atan(radTotalReach / radTotalStack) * 180 / Math.PI);
    
    const seatedReach = radTotalReach + seatPosReach;
    const seatedReachHeight = seatedReach / finalHeight;
    const barSaddleHeight = radTotalStack - seatPosStack + 15;
    
    // SHO calculation
    const barStemTotalReach = stemReach + (handlebarSetback * -1);
    const barStemTotalRise = stemStack + handlebarRise;
    const internalHeadAngle = 90 - headAngle;
    const internalHeadAngleRad = (internalHeadAngle * Math.PI) / 180;
    const ninetyRad = Math.PI / 2;
    const behindSteeringAxis = barStemTotalRise * Math.sin(internalHeadAngleRad) / Math.sin(internalHeadAngleRad - ninetyRad) * -1;
    const sho = behindSteeringAxis + barStemTotalReach;
    
    const bikeVsRiderRAD = radLength - finalRAD;

    // HHI PROPRIETARY CALCULATION
    const seatedReachHoriz = seatedReach;
    const seatedReachVert = barSaddleHeight;
    const inverseSeatedReachVert = seatedReachVert * -1;
    const seatedReachDiagonal = Math.sqrt(seatedReachHoriz**2 + seatedReachVert**2);
    
    const torsoAngleCalc = Math.max(-1, Math.min(1, 
        ((torsoLength**2 + (seatedReach**2 + barSaddleHeight**2) - armLength**2) / 
        (2 * torsoLength * Math.sqrt(seatedReach**2 + barSaddleHeight**2)))
    ));
    const torsoAngle = (Math.acos(torsoAngleCalc) * 180 / Math.PI) + (Math.atan(seatedReachVert / seatedReachHoriz) * 180 / Math.PI);
    
    const angleG = Math.acos((armLength**2 + seatedReachDiagonal**2 - torsoLength**2) / (2 * armLength * seatedReachDiagonal)) * 180 / Math.PI;
    const angleSGAbsolute = Math.atan(seatedReachVert / seatedReachHoriz) * 180 / Math.PI;
    const angleSAbsolute = torsoAngle + angleSGAbsolute;
    const angleGAbsolute = angleG - angleSGAbsolute;
    
    // Excel ATAN2(x,y) = JavaScript atan2(y,x)
    const seatShoulderVert = torsoLength * Math.cos(Math.atan2(seatedReachHoriz, inverseSeatedReachVert) + (angleSAbsolute * Math.PI / 180)) * -1;
    const seatShoulderHoriz = torsoLength * Math.sin(Math.atan2(seatedReachHoriz, inverseSeatedReachVert) + (angleSAbsolute * Math.PI / 180));
    const gripShoulderVert = armLength * Math.cos(Math.atan2(seatedReachHoriz, inverseSeatedReachVert) + (angleGAbsolute * Math.PI / 180)) * -1;
    const gripShoulderHoriz = armLength * Math.sin(Math.atan2(seatedReachHoriz, inverseSeatedReachVert) + (angleGAbsolute * Math.PI / 180));
    
    const torsoCOMDistance = seatShoulderHoriz * 0.6;
    const armCOMDistance = gripShoulderHoriz * 0.6;
    
    const determinate = (seatedReachHoriz - seatShoulderHoriz) * (-seatShoulderVert) - (seatedReachVert + seatShoulderVert) * seatShoulderHoriz;
    
    const forceGripsVertical = (armMass * (armCOMDistance - seatShoulderHoriz) * (-seatShoulderVert) - (seatedReachVert + seatShoulderVert) * (torsoMass * torsoCOMDistance - armMass * seatShoulderHoriz)) / determinate;
    const forceGripsHorizontal = ((seatedReachDiagonal - gripShoulderHoriz) * (torsoMass * torsoCOMDistance - armMass * seatShoulderHoriz) - armMass * (armCOMDistance - seatShoulderHoriz) * seatShoulderHoriz) / determinate * -1;
    
    const totalForce = forceGripsVertical + forceGripsHorizontal;
    const hhi = totalForce * 3.14;

    return NextResponse.json({
      calculatedRAD: finalRAD,
      calculatedInseam: finalInseam,
      finalHeight,
      radLength,
      bikeVsRiderRAD,
      radAngle,
      seatedReach,
      seatedReachHeight,
      saddleHeight,
      barSaddleHeight,
      sho,
      hhi
    });

  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}
