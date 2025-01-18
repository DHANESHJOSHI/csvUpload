import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { scaleLinear } from 'd3-scale';

const ComposableMap = dynamic(() => import('react-simple-maps').then((mod) => mod.ComposableMap), { ssr: false });
const Geographies = dynamic(() => import('react-simple-maps').then((mod) => mod.Geographies), { ssr: false });
const Geography = dynamic(() => import('react-simple-maps').then((mod) => mod.Geography), { ssr: false });
const ZoomableGroup = dynamic(() => import('react-simple-maps').then((mod) => mod.ZoomableGroup), { ssr: false });

const IndiaMap = ({ geoUrl, stateWiseAnalytics = [], genderData = [], scholarshipData = [], stateTypeWiseAnalytics = [], onStateClick }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

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
      Math.min(...stateWiseAnalytics.map((s) => s.count || 0)),
      Math.max(...stateWiseAnalytics.map((s) => s.count || 0)),
    ])
    .range(['#ff9c35', '#ff9c35']); //0066CC, f4c430

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
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const tooltipWidth = 300; // Tooltip width
    const tooltipHeight = 200; // Tooltip height
  
    let x = event.clientX;
    let y = event.clientY;
  
    // Calculate available space around the cursor
    const spaceAbove = y; // Space above the cursor
    const spaceBelow = windowHeight - y; // Space below the cursor
    const spaceLeft = x; // Space to the left of the cursor
    const spaceRight = windowWidth - x; // Space to the right of the cursor
  
    // Adjust horizontal position
    if (spaceRight < tooltipWidth + 20) {
      x = x - (tooltipWidth - spaceRight + 20); // Move left if not enough space on the right
    }
    if (x < 20) {
      x = 20; // Keep the tooltip within the left boundary
    }
  
    // Adjust vertical position
    if (spaceBelow >= tooltipHeight + 300) {
      // If there's enough space below, show it below
      y = y + 10;
    } else if (spaceAbove >= tooltipHeight + 250) {
      // If there's enough space above, show it above
      y = y - tooltipHeight - 250;
    } else if (spaceBelow > spaceAbove) {
      // If there's more space below than above but not enough, adjust within the bottom boundary
      y = windowHeight - tooltipHeight - 250;
    } else {
      // If there's more space above but not enough, adjust within the top boundary
      y = 20;
    }
  
    return { x, y };
  };
  


  const moneyIcon = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="2048" height="2048" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd"><defs><style>.fil0{fill:none}.fil1{fill:#212121;fill-rule:nonzero}</style></defs><g id="Layer_x0020_1"><g id="_393275392"><path id="_393288064" class="fil0" d="M0 0h2048v2048H0z"/><path id="_393275632" class="fil0" d="M255.999 255.999h1536v1536h-1536z"/></g><path class="fil1" d="M411.893 1288.34c-24.002 60.62-38.903 120.712-47.82 176.534-9.01 56.421-12.042 108.569-12.198 152.636H352v.322c0 31.03 11.313 58.926 29.59 78.967 17.616 19.315 41.669 31.276 67.964 31.33v-.126h1148.9v.126c26.294-.056 50.345-12.016 67.959-31.33 18.35-20.12 29.708-48.02 29.708-78.952h-.125v-.337h.125c-.085-49.199-3.83-108.371-15.424-172.143-9.118-50.166-23.209-103.37-44.382-157.043l-.043.016c-49.338-124.759-119.38-255.213-200.426-369.185-71.448-100.476-151.267-188-232.655-247.152h-358.38c-81.412 59.165-161.252 146.72-232.698 247.23-80.997 113.946-150.98 244.37-200.223 369.107zm-110.819 166.534c9.661-60.484 25.672-125.26 51.32-190.034 50.903-128.943 123.5-264.123 207.723-382.608 77.848-109.514 165.83-204.918 256.167-268.355l18.376-5.876h378.689l18.375 5.876c90.312 63.422 178.271 158.796 256.125 268.278 84.263 118.498 156.92 253.707 207.926 382.685v.124c22.627 57.33 37.78 114.713 47.675 169.151 12.347 67.913 16.335 130.96 16.426 183.395h.125v.337h-.125c.001 47.546-17.665 90.654-46.208 121.952-29.279 32.104-70.005 51.986-115.21 52.08v.126H449.557v-.126c-45.204-.092-85.932-19.974-115.215-52.082-28.623-31.385-46.34-74.506-46.34-121.965v-.322h.126c.166-47.127 3.385-102.749 12.95-162.636zM783.68 319.876c-5.094.018-9.683 1.538-13.49 4.067a25.25 25.25 0 0 0-8.282 9.15c-1.981 3.715-3.068 7.915-3.052 12.207.015 4.425 1.39 9.13 4.4 13.659l101.448 153.039h333.468l101.447-153.04c3.007-4.528 4.382-9.23 4.397-13.656a25.806 25.806 0 0 0-3.053-12.206 25.244 25.244 0 0 0-8.284-9.149c-3.803-2.526-8.39-4.044-13.485-4.062l-495.514-.009zm-48.74-49.185c13.634-9.059 30.193-14.503 48.74-14.566l495.514.01c18.543.063 35.102 5.504 48.736 14.561 12.392 8.232 22.392 19.475 29.284 32.4 6.85 12.843 10.604 27.357 10.553 42.206-.056 16.655-4.711 33.575-14.897 48.908l-110.976 167.414-9.529 14.375H830.512l-9.53-14.375L710.004 394.21c-10.187-15.332-14.843-32.25-14.9-48.91-.052-14.846 3.702-29.358 10.552-42.206 6.89-12.922 16.89-24.17 29.283-32.403z"/><g id="_393287176"><path id="_393274456" class="fil1" d="M1011.98 1431.6v-90.108c-22.501-8.078-39.01-20.195-49.526-36.498-10.457-16.303-15.745-36.057-15.745-59.264 0-23.5 5.934-43.253 17.8-59.263 11.928-16.01 27.731-25.19 47.471-27.686v-21.297h24.91v21.297c18.271 2.79 32.783 10.502 43.594 23.354 10.75 12.85 17.624 30.035 20.62 51.552l-43.533 7.122c-2.644-16.963-9.519-28.42-20.682-34.44v84.085c27.556 9.326 46.355 21.444 56.285 36.278 9.987 14.834 14.98 33.854 14.98 57.134 0 25.923-6.285 47.807-18.8 65.58-12.572 17.844-30.08 28.713-52.465 32.751v40.244h-24.909v-39.215c-19.857-3.01-36.013-12.264-48.41-27.76-12.397-15.421-20.269-37.306-23.735-65.579l44.944-6.021c1.821 11.455 5.288 21.37 10.34 29.668 4.994 8.298 10.633 14.32 16.86 18.066zm0-225.893c-6.815 2.864-12.16 7.785-16.215 14.614-3.995 6.903-5.992 14.542-5.992 22.839 0 7.564 1.821 14.688 5.464 21.15 3.701 6.536 9.282 11.823 16.743 15.863v-74.466zm24.91 228.904c8.637-1.983 15.628-6.977 21.033-14.908 5.406-8.004 8.108-17.33 8.108-28.127 0-9.62-2.291-17.845-6.816-24.822-4.523-6.975-11.984-12.336-22.325-16.009v83.866z"/><path id="_393283864" class="fil1" d="M1024 1056c75.647 0 144.139 30.667 193.716 80.244s80.243 118.068 80.243 193.715-30.666 144.14-80.243 193.716c-49.577 49.577-118.069 80.243-193.716 80.243s-144.139-30.666-193.716-80.243-80.243-118.069-80.243-193.716 30.666-144.138 80.243-193.715S948.353 1056 1024 1056zm148.466 125.495c-37.991-37.991-90.484-61.493-148.466-61.493-57.982 0-110.474 23.502-148.466 61.493-37.991 37.991-61.492 90.483-61.492 148.465 0 57.981 23.5 110.474 61.492 148.466 37.991 37.991 90.484 61.492 148.466 61.492 57.981 0 110.474-23.5 148.466-61.492 37.991-37.991 61.492-90.484 61.492-148.466 0-57.981-23.5-110.473-61.492-148.465z"/></g></g></svg>`;

  const renderTooltipContent = (stateCode, analytics) => {
    const genderInfo = analytics.genderInfo || {};
    const scholarshipInfo = analytics.stateTypeInfo[0]?.total || {};
    const scholarshipAmount = analytics.totalAmount || {};
    const stateTypeInfo = analytics.stateTypeInfo || [];

    return `📍 State: ${stateCode}
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
💰 Total Disbursed Amount: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(analytics.stateTypeInfo[0]?.amountDisbursed || 0)}
💰 Total Amount: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(analytics.stateTypeInfo[0]?.totalAmount || 0)}
  ${stateTypeInfo.map((st) => `🎓: ${st._id.scholarshipName}: ${st.total}`).join('\n') || 'No data available'}`;
  };
 

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
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
            whiteSpace: 'pre-wrap',
            border: '1px solid #000000',
            maxWidth: '350px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxHeight: 'calc(100vh - 40px)',  // Ensure the tooltip doesn't overflow the screen
            overflowY: 'auto',
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
      // console.log('Analytics for', stateCode, analytics);
      // Calculate centroid for positioning the text (assuming geo.properties.centroid is available)
      const centroid = geo.properties.centroid || [0, 0]; // Use centroid if available

      return (
        <Geography
          key={geo.rsmKey}
          geography={geo}
          fill={fillColor}
          stroke="#000000"
          strokeWidth={1}
          style={{
            default: { transition: 'all 0.3s ease' },
            hover: {
              fill: '#90EE90',
              cursor: 'pointer',
              stroke: '#000000',
              strokeWidth: 2,
            },
            pressed: { fill: '#d9d9d9' },
          }}
          onClick={() => onStateClick(stateCode)}
          onMouseEnter={(evt) => {
            const pos = handleTooltipPosition(evt);
            const content = renderTooltipContent(stateCode, analytics);
            setTooltipContent(content);
            setTooltipPosition(pos);
          }}
          onMouseMove={(evt) => {
            const pos = handleTooltipPosition(evt);
            setTooltipPosition(pos);
          }}
          onMouseLeave={() => setTooltipContent('')}
        >
          {/* Display state name at the centroid */}
          {/* <text
            x={centroid[0]}
            y={centroid[1]}
            textAnchor="middle"
            fontSize={isMobile ? '10px' : '14px'}
            fill="#000000"
            fontWeight="bold"
            className='text-black'
          >
            {stateCode}
          </text> */}
        </Geography>
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
