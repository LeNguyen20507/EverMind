/**
 * PageLayout Component
 * Wrapper component providing consistent page structure with header
 */

import { Construction } from 'lucide-react';

const PageLayout = ({ 
  title, 
  description, 
  icon: Icon,
  bunnyImage,
  themeColor = '#14B8A6',
  children 
}) => {
  return (
    <div className="page" style={{ '--theme-color': themeColor }}>
      {/* Page Header */}
      <header className="page-header" style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`
      }}>
        {/* Bunny Mascot as Main Icon */}
        {bunnyImage ? (
          <div className="page-header-bunny">
            <img 
              src={bunnyImage} 
              alt="" 
              style={{ 
                width: '70px', 
                height: '70px',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                animation: 'float 3s ease-in-out infinite'
              }}
            />
          </div>
        ) : Icon && (
          <Icon className="page-header-icon" size={48} />
        )}
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {/* Page Content */}
      <div className="page-content">
        {/* Under Development Badge */}
        <div className="dev-badge">
          <Construction size={16} />
          UNDER DEVELOPMENT
        </div>

        {children}
      </div>
    </div>
  );
};

export default PageLayout;
