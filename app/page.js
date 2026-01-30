'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // Build name
  const [buildName, setBuildName] = useState('My Sweet Bike');
  
  // Rider inputs
  const [riderHeight, setRiderHeight] = useState(1750);
  
  // Frame inputs
  const [headAngle, setHeadAngle] = useState(66);
  const [reach, setReach] = useState(410);
  const [stack, setStack] = useState(635);
  const [seatAngle, setSeatAngle] = useState(74);
  
  // Component inputs
  const [handlebarSetback, setHandlebarSetback] = useState(30);
  const [handlebarRise, setHandlebarRise] = useState(20);
  const [stemLength, setStemLength] = useState(40);
  const [stemAngle, setStemAngle] = useState(5);
  const [stemHeight, setStemHeight] = useState(40);
  const [spacers, setSpacers] = useState(10);
  const [topCap, setTopCap] = useState(5);
  const [crankLength, setCrankLength] = useState(170);
  const [pedalThickness, setPedalThickness] = useState(20);
  
  // Results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCalculation = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riderHeight,
          headAngle,
          reach,
          stack,
          seatAngle,
          handlebarSetback,
          handlebarRise,
          stemLength,
          stemAngle,
          stemHeight,
          spacers,
          topCap,
          crankLength,
          pedalThickness
        })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Calculation failed. Please try again.');
    }
    
    setLoading(false);
  };

  const copyResults = () => {
    const text = document.getElementById('results-text').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copy-btn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.style.backgroundColor = '#16a34a';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '#2563eb';
      }, 2000);
    });
  };

  const getHHIDisplay = (hhi, barSaddleHeight) => {
    if (hhi < 0) {
      return barSaddleHeight > 0 ? 'Very Light' : 'Very Heavy';
    } else if (hhi >= 100) {
      return 'Very Heavy';
    } else {
      return Math.max(1, Math.round(hhi));
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* LEFT COLUMN - INPUTS */}
          <div className={styles.leftColumn}>
            
            {/* Build Name */}
            <div className={styles.card}>
              <label>Build Name</label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Rider Inputs */}
            <div className={styles.card}>
              <h2>Rider Inputs</h2>
              <div className={styles.inputGroup}>
                <label>Height (mm)</label>
                <input
                  type="number"
                  value={riderHeight}
                  onChange={(e) => setRiderHeight(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Frame Geometry */}
            <div className={styles.card}>
              <h2>Frame Geometry</h2>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Head Angle (°)</label>
                  <input
                    type="number"
                    value={headAngle}
                    onChange={(e) => setHeadAngle(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Seat Angle (°)</label>
                  <input
                    type="number"
                    value={seatAngle}
                    onChange={(e) => setSeatAngle(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Reach (mm)</label>
                  <input
                    type="number"
                    value={reach}
                    onChange={(e) => setReach(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Stack (mm)</label>
                  <input
                    type="number"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Components */}
            <div className={styles.card}>
              <h2>Components</h2>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Handlebar Setback (mm)</label>
                  <input
                    type="number"
                    value={handlebarSetback}
                    onChange={(e) => setHandlebarSetback(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Handlebar Rise (mm)</label>
                  <input
                    type="number"
                    value={handlebarRise}
                    onChange={(e) => setHandlebarRise(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Stem Length (mm)</label>
                  <input
                    type="number"
                    value={stemLength}
                    onChange={(e) => setStemLength(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Stem Angle (°)</label>
                  <input
                    type="number"
                    value={stemAngle}
                    onChange={(e) => setStemAngle(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Stem Height (mm)</label>
                  <input
                    type="number"
                    value={stemHeight}
                    onChange={(e) => setStemHeight(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Spacers Below Stem (mm)</label>
                  <input
                    type="number"
                    value={spacers}
                    onChange={(e) => setSpacers(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Headset Top Cap (mm)</label>
                  <input
                    type="number"
                    value={topCap}
                    onChange={(e) => setTopCap(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Crank Length (mm)</label>
                  <input
                    type="number"
                    value={crankLength}
                    onChange={(e) => setCrankLength(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Pedal Thickness (mm)</label>
                  <input
                    type="number"
                    value={pedalThickness}
                    onChange={(e) => setPedalThickness(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - RESULTS */}
          <div className={styles.rightColumn}>
            <div className={styles.card}>
              <h2>Results</h2>
              <button 
                onClick={runCalculation} 
                className={styles.runButton}
                disabled={loading}
              >
                {loading ? 'CALCULATING...' : 'RUN DiRT'}
              </button>

              {results && (
                <div className={styles.results}>
                  <div className={styles.resultRow}>
                    <span>Bike RAD</span>
                    <span>{Math.round(results.radLength)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Bike vs Rider RAD</span>
                    <span>{Math.round(results.bikeVsRiderRAD)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Bike RAD Angle</span>
                    <span>{Math.round(results.radAngle)}°</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Seated Reach</span>
                    <span>{Math.round(results.seatedReach)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Seated Reach/Height</span>
                    <span>{Math.round(results.seatedReachHeight * 100)}%</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Saddle Height (BB)</span>
                    <span>{Math.round(results.saddleHeight)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Bar/Saddle Height</span>
                    <span>{Math.round(results.barSaddleHeight)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>SHO</span>
                    <span>{Math.round(results.sho)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Heavy Hands Index</span>
                    <span>{getHHIDisplay(results.hhi, results.barSaddleHeight)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copy Results Section */}
        {results && (
          <div className={styles.copySection}>
            <button 
              id="copy-btn"
              onClick={copyResults} 
              className={styles.copyButton}
            >
              Copy to Clipboard
            </button>
            <div className={styles.resultsText}>
              <pre id="results-text">
{`═══════════════════════════════════════════════════════
DiRT Results - ${new Date().toLocaleDateString()}
Build: ${buildName}
═══════════════════════════════════════════════════════

RIDER
  Height: ${riderHeight} mm
  RAD: ${Math.round(results.calculatedRAD)} mm
  Inseam: ${Math.round(results.calculatedInseam)} mm

FRAME GEOMETRY
  Head Angle: ${headAngle}°
  Seat Angle: ${seatAngle}°
  Reach: ${reach} mm
  Stack: ${stack} mm

COMPONENTS
  Handlebar Setback: ${handlebarSetback} mm
  Handlebar Rise: ${handlebarRise} mm
  Stem Length: ${stemLength} mm
  Stem Angle: ${stemAngle}°
  Stem Height: ${stemHeight} mm
  Spacers Below Stem: ${spacers} mm
  Headset Top Cap: ${topCap} mm
  Crank Length: ${crankLength} mm
  Pedal Thickness: ${pedalThickness} mm

RESULTS
  Bike RAD: ${Math.round(results.radLength)} mm
  Bike vs Rider RAD: ${Math.round(results.bikeVsRiderRAD)} mm
  Bike RAD Angle: ${Math.round(results.radAngle)}°
  Seated Reach: ${Math.round(results.seatedReach)} mm
  Seated Reach/Height: ${Math.round(results.seatedReachHeight * 100)}%
  Saddle Height (BB): ${Math.round(results.saddleHeight)} mm
  Bar/Saddle Height: ${Math.round(results.barSaddleHeight)} mm
  SHO: ${Math.round(results.sho)} mm
  Heavy Hands Index: ${getHHIDisplay(results.hhi, results.barSaddleHeight)}

═══════════════════════════════════════════════════════`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
