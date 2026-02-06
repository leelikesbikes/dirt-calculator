'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { bikes } from './bike-data';

export default function Home() {
  // Helper component for labels with help links
  const LabelWithHelp = ({ text, helpUrl }) => (
    <label>
      {text}{' '}
      <a 
        href={`https://www.llbmtb.com/${helpUrl}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.helpLink}
      >
        (?)
      </a>
    </label>
  );

  // Build name
  const [buildName, setBuildName] = useState('My Sweet Bike');
  
  // Bike selector
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  // Get unique brands
  const brands = [...new Set(bikes.map(bike => bike.brand))].sort();
  
  // Get models for selected brand
  const modelsForBrand = selectedBrand 
    ? bikes.filter(bike => bike.brand === selectedBrand)
    : [];
  
  // Get selected bike object
  const selectedBike = selectedBrand && selectedModel
    ? bikes.find(bike => bike.brand === selectedBrand && bike.model === selectedModel)
    : null;
  
  // Component selectors
  const [handlebarType, setHandlebarType] = useState('bike-default'); // 'bike-default', 'choose-bar', 'enter-specs'
  const [stemType, setStemType] = useState('bike-default'); // 'bike-default', 'choose-stem', 'enter-specs'
  
  // Rider inputs
  const [proportionType, setProportionType] = useState('Average');
  const [riderHeight, setRiderHeight] = useState(1750);
  const [providedHeight, setProvidedHeight] = useState(1750);
  const [providedRAD, setProvidedRAD] = useState(782);
  const [providedInseam, setProvidedInseam] = useState(805);
  
  // Frame inputs
  const [headAngle, setHeadAngle] = useState(66);
  const [reach, setReach] = useState(410);
  const [stack, setStack] = useState(635);
  const [seatAngle, setSeatAngle] = useState(74);
  
  // Component inputs
  const [handlebarSetback, setHandlebarSetback] = useState(30);
  const [handlebarRise, setHandlebarRise] = useState(20);
  const [stemLength, setStemLength] = useState(40);
  const [stemAngle, setStemAngle] = useState(0);
  const [stemHeight, setStemHeight] = useState(40);
  const [spacers, setSpacers] = useState(10);
  const [topCap, setTopCap] = useState(5);
  const [crankLength, setCrankLength] = useState(170);
  const [pedalThickness, setPedalThickness] = useState(15);
  
  // Results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Register service worker for offline capability (works even in iframe)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .catch(() => {
          // Silently fail - not critical
        });
    }
  }, []);

  // Handle bike selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    
    if (selectedBike && size) {
      const sizeData = selectedBike.sizes[size];
      
      // Set build name to bike info
      setBuildName(`${selectedBike.brand} - ${selectedBike.displayName} - ${size}`);
      
      // Populate frame geometry
      setHeadAngle(sizeData.headAngle);
      setReach(sizeData.reach);
      setStack(sizeData.stack);
      setSeatAngle(sizeData.seatAngle);
      
      // Populate components
      setHandlebarSetback(sizeData.handlebarSetback);
      setHandlebarRise(sizeData.handlebarRise);
      setStemLength(sizeData.stemLength);
      setStemAngle(sizeData.stemAngle);
      setStemHeight(sizeData.stemHeight);
      setSpacers(sizeData.spacers);
      setTopCap(sizeData.topCap);
      setCrankLength(sizeData.crankLength);
      setPedalThickness(sizeData.pedalThickness);
    }
  };
  
  // Reset build name when switching to manual entry
  const handleBrandChange = (brand) => {
    if (brand === '') {
      setBuildName('My Sweet Bike');
      setSelectedModel('');
      setSelectedSize('');
    }
    setSelectedBrand(brand);
    setSelectedModel('');
    setSelectedSize('');
  };
  
  const handleModelChange = (model) => {
    setSelectedModel(model);
    setSelectedSize('');
  };

  const runCalculation = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proportionType,
          riderHeight,
          providedHeight,
          providedRAD,
          providedInseam,
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

  const copyResults = async () => {
    const text = document.getElementById('results-text').textContent;
    const btn = document.getElementById('copy-btn');
    
    try {
      // This should work on HTTPS
      await navigator.clipboard.writeText(text);
      
      // Show success
      const originalText = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.style.backgroundColor = '#16a34a';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '#ed1c24';
      }, 2000);
      
    } catch (err) {
      // If it fails, try textarea method
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.backgroundColor = '#16a34a';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '#ed1c24';
        }, 2000);
      } catch (err2) {
        btn.textContent = 'Copy failed - please select text manually';
        setTimeout(() => {
          btn.textContent = 'Copy to Clipboard';
        }, 3000);
      }
      
      document.body.removeChild(textarea);
    }
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
            
            {/* Bike Selector */}
            <div className={styles.card}>
              <h2>
                Choose Your Bike{' '}
                <a 
                  href="https://www.llbmtb.com/choose-your-bike" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.helpLink}
                >
                  (?)
                </a>
              </h2>
              
              <div className={styles.inputGroup}>
                <label>Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Enter frame specs manually</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBrand && (
                <div className={styles.inputGroup}>
                  <label>Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Select model</option>
                    {modelsForBrand.map((bike, index) => (
                      <option key={index} value={bike.model}>
                        {bike.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedBike && (
                <div className={styles.inputGroup}>
                  <label>Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Select size</option>
                    {Object.keys(selectedBike.sizes).map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Build Name */}
            <div className={styles.card}>
              <LabelWithHelp text="Build Name" helpUrl="build-name" />
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
              
              {/* Proportion Type Selector */}
              <div className={styles.inputGroup}>
                <LabelWithHelp text="Proportions" helpUrl="proportions" />
                <select
                  value={proportionType}
                  onChange={(e) => setProportionType(e.target.value)}
                  className={styles.input}
                >
                  <option value="Average">Average</option>
                  <option value="Not average">Not average</option>
                </select>
              </div>

              {/* Conditional Inputs Based on Proportion Type */}
              {proportionType === 'Average' ? (
                <>
                  <div className={styles.inputGroup}>
                    <LabelWithHelp text="Height (mm)" helpUrl="height" />
                    <input
                      type="number"
                      value={riderHeight}
                      onChange={(e) => setRiderHeight(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  {riderHeight && (
                    <div className={styles.helpText}>
                      RAD: {Math.round(riderHeight * 0.447)} mm | Inseam: {Math.round(riderHeight * 0.46)} mm
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.inputGroup}>
                    <LabelWithHelp text="Height (mm)" helpUrl="height" />
                    <input
                      type="number"
                      value={providedHeight}
                      onChange={(e) => setProvidedHeight(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <LabelWithHelp text="RAD (mm)" helpUrl="rad" />
                    <input
                      type="number"
                      value={providedRAD}
                      onChange={(e) => setProvidedRAD(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <LabelWithHelp text="Inseam (mm)" helpUrl="inseam" />
                    <input
                      type="number"
                      value={providedInseam}
                      onChange={(e) => setProvidedInseam(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Frame Geometry */}
            <div className={styles.card}>
              <h2>Frame Geometry</h2>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <LabelWithHelp text="Head Angle (°)" helpUrl="head-angle" />
                  <input
                    type="number"
                    value={headAngle}
                    onChange={(e) => setHeadAngle(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <LabelWithHelp text="Seat Angle (°)" helpUrl="seat-angle" />
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
                  <LabelWithHelp text="Reach (mm)" helpUrl="reach" />
                  <input
                    type="number"
                    value={reach}
                    onChange={(e) => setReach(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <LabelWithHelp text="Stack (mm)" helpUrl="stack" />
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
                  <LabelWithHelp text="Handlebar Setback (mm)" helpUrl="handlebar-setback" />
                  <input
                    type="number"
                    value={handlebarSetback}
                    onChange={(e) => setHandlebarSetback(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <LabelWithHelp text="Handlebar Rise (mm)" helpUrl="handlebar-rise" />
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
                  <LabelWithHelp text="Stem Length (mm)" helpUrl="stem-length" />
                  <input
                    type="number"
                    value={stemLength}
                    onChange={(e) => setStemLength(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <LabelWithHelp text="Stem Angle (°)" helpUrl="stem-angle" />
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
                  <LabelWithHelp text="Stem Height (mm)" helpUrl="stem-height" />
                  <input
                    type="number"
                    value={stemHeight}
                    onChange={(e) => setStemHeight(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <LabelWithHelp text="Spacers Below Stem (mm)" helpUrl="spacers-below-stem" />
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
                  <LabelWithHelp text="Headset Top Cap (mm)" helpUrl="headset-top-cap" />
                  <input
                    type="number"
                    value={topCap}
                    onChange={(e) => setTopCap(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <LabelWithHelp text="Crank Length (mm)" helpUrl="crank-length" />
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
                  <LabelWithHelp text="Pedal Thickness (mm)" helpUrl="pedal-thickness" />
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
          <div className={styles.rightColumn} style={{ position: 'sticky', top: '20px', alignSelf: 'flex-start' }}>
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
                    <span>
                      Bike RAD{' '}
                      <a href="https://www.llbmtb.com/bike-rad" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{Math.round(results.radLength)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      Bike vs Rider RAD{' '}
                      <a href="https://www.llbmtb.com/bike-vs-rider-rad" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{results.bikeVsRiderRAD >= 0 ? '+' : ''}{Math.round(results.bikeVsRiderRAD)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      Bike RAD Angle{' '}
                      <a href="https://www.llbmtb.com/bike-rad-angle" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{Math.round(results.radAngle)}°</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      Seated Reach{' '}
                      <a href="https://www.llbmtb.com/seated-reach" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{Math.round(results.seatedReach)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      Seated Reach/Height{' '}
                      <a href="https://www.llbmtb.com/seated-reach-height" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{Math.round(results.seatedReachHeight * 100)}%</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      Saddle Height from BB{' '}
                      <a href="https://www.llbmtb.com/saddle-height-from-bb" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{Math.round(results.saddleHeight)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      Bar/Saddle Height{' '}
                      <a href="https://www.llbmtb.com/bar-saddle-height" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{Math.round(results.barSaddleHeight)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      SHO{' '}
                      <a href="https://www.llbmtb.com/sho" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
                    <span>{Math.round(results.sho)} mm</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span>
                      Heavy Hands Index{' '}
                      <a href="https://www.llbmtb.com/heavy-hands-index" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>(?)</a>
                    </span>
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
  Proportions: ${proportionType}
  Height: ${Math.round(results.finalHeight)} mm
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
  Bike vs Rider RAD: ${results.bikeVsRiderRAD >= 0 ? '+' : ''}${Math.round(results.bikeVsRiderRAD)} mm
  Bike RAD Angle: ${Math.round(results.radAngle)}°
  Seated Reach: ${Math.round(results.seatedReach)} mm
  Seated Reach/Height: ${Math.round(results.seatedReachHeight * 100)}%
  Saddle Height from BB: ${Math.round(results.saddleHeight)} mm
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
