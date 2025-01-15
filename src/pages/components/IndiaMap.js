import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { scaleLinear } from 'd3-scale';

const ComposableMap = dynamic(() => import('react-simple-maps').then((mod) => mod.ComposableMap), { ssr: false });
const Geographies = dynamic(() => import('react-simple-maps').then((mod) => mod.Geographies), { ssr: false });
const Geography = dynamic(() => import('react-simple-maps').then((mod) => mod.Geography), { ssr: false });
const ZoomableGroup = dynamic(() => import('react-simple-maps').then((mod) => mod.ZoomableGroup), { ssr: false });

const IndiaMap = ({ geoUrl, stateWiseAnalytics, genderData, scholarshipData, stateTypeWiseAnalytics, onStateClick }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  if (!stateWiseAnalytics || !Array.isArray(stateWiseAnalytics)) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const safeArray = (data) => (Array.isArray(data) ? data : []);

  const colorScale = scaleLinear()
    .domain([
      Math.min(...stateWiseAnalytics.map((s) => s.count)),
      Math.max(...stateWiseAnalytics.map((s) => s.count)),
    ])
    .range(['#ffffff', '#4a90e2']); // Light blue gradient

  const getStateAnalytics = (stateCode) => {
    const stateData = safeArray(stateWiseAnalytics).find((state) => state._id === stateCode) || {};
    const genderInfo = safeArray(stateTypeWiseAnalytics).find((g) => g._id === stateCode) || {};
    const scholarshipInfo = safeArray(scholarshipData).find((s) => s._id === stateCode) || {};
    const stateTypeInfo = safeArray(stateTypeWiseAnalytics).filter((st) => st._id.state === stateCode);
    
    return {
      ...stateData,
      genderInfo,
      scholarshipInfo,
      stateTypeInfo,
    };
  };

  const handleTooltipPosition = (event) => {
    return {
      x: event.clientX,
      y: event.clientY
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        width: '100%',
        height: '100%',
        padding: '40px',
        borderRadius: '30px',
        background: '#ffffff',
        border: '2px solid #000000',
        position: 'relative',
      }}
    >
      {tooltipContent && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            padding: '20px 24px',
            background: '#ffffff',
            color: '#000000',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.8',
            fontWeight: '500',
            pointerEvents: 'none',
            zIndex: 1000,
            transform: 'translate(10px, -50%)',
            whiteSpace: 'pre-wrap',
            border: '1px solid #000000',
            maxWidth: '350px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          {tooltipContent}
        </motion.div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1100,
          center: [82.8, 22],
        }}
        style={{
          width: '100%',
          height: 'calc(100vh - 100px)',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#ffffff',
          border: '2px solid #000000',
        }}
      >
        <ZoomableGroup zoom={1} minZoom={0.5} maxZoom={8} center={[82.8, 22]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateCode = geo.properties.st_nm;
                const analytics = getStateAnalytics(stateCode);
                const fillColor = colorScale(analytics.count || 0);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#000000"
                    strokeWidth={1}
                    style={{
                      default: { 
                        transition: 'all 0.3s ease'
                      },
                      hover: { 
                        fill: '#90EE90',
                        cursor: 'pointer',
                        stroke: '#000000',
                        strokeWidth: 2
                      },
                      pressed: { 
                        fill: '#d9d9d9'
                      },
                    }}
                    onClick={() => onStateClick(stateCode)}
                    onMouseEnter={(evt) => {
                      const genderInfo = analytics.genderInfo || {};
                      const scholarshipInfo = analytics.stateTypeInfo[0]?.total || {};
                      const scholarshipAmount = analytics.totalAmount || {};
                      const stateTypeInfo = analytics.stateTypeInfo || [];
                      
                      const pos = handleTooltipPosition(evt);

                      const content = `${stateCode}
━━━━━━━━━━━━━━━━━━
📊 Total Applications: ${analytics.count || 0}
✅ Selected: ${analytics.stateTypeInfo[0]?.selected || 0}
❌ Not Selected: ${analytics.stateTypeInfo[0]?.notSelected || 0}

Gender Distribution
━━━━━━━━━━━━━━━━━━
👨 Male: ${analytics.stateTypeInfo[0]?.male || 0}
👩 Female: ${analytics.stateTypeInfo[0]?.female || 0}
⭐ Other: ${analytics.stateTypeInfo[0]?.other || 0}

Scholarships & State Type
━━━━━━━━━━━━━━━━━━
🎓 Total: ${scholarshipInfo.total || 0}
🎓 Total Amount: ₹${scholarshipAmount.total || 0}
${stateTypeInfo.map(st => `${st._id.scholarshipName}: ${st.total}`).join('\n') || 'No data available'}`;

                      setTooltipContent(content);
                      setTooltipPosition(pos);
                    }}
                    onMouseMove={(evt) => {
                      const pos = handleTooltipPosition(evt);
                      setTooltipPosition(pos);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </motion.div>
  );
};

export default IndiaMap;