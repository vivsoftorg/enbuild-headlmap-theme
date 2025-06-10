import { useState, useEffect } from 'react';

// Resource types and their icons
const resourceTypes = {
  codebases: {
    icon: '📁',
    title: 'Codebases',
    path: '/codebases',
    color: '#ea4335',
  },
  branches: {
    icon: '🔀',
    title: 'Branches',
    path: '/branches',
    color: '#ea4335',
  },
  pipelines: {
    icon: '🔄',
    title: 'Pipelines',
    path: '/pipelines',
    color: '#ea4335',
  },
  deployments: {
    icon: '🚀',
    title: 'Deployment Flows',
    path: '/deployment-flows',
    color: '#ea4335',
  },
  environments: {
    icon: '☁️',
    title: 'Environments',
    path: '/environments',
    color: '#ea4335',
  },
};

// Mock data
const mockData = {
  codebases: Array(3)
    .fill(0)
    .map((_, i) => ({ name: `codebase-${i}`, status: 'Active' })),
  branches: Array(5)
    .fill(0)
    .map((_, i) => ({ name: `feature-branch-${i}`, status: 'Active' })),
  pipelines: Array(4)
    .fill(0)
    .map((_, i) => ({ name: `pipeline-${i}`, status: 'Running' })),
  deployments: Array(2)
    .fill(0)
    .map((_, i) => ({ name: `deployment-${i}`, status: 'Active' })),
  environments: Array(3)
    .fill(0)
    .map((_, i) => ({ name: `env-${i}`, status: 'Healthy' })),
};

// Inline styles for Headlamp compatibility
const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '32px',
  },
  header: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '400',
    color: '#202124',
    margin: '0 0 12px 0',
  },
  refreshButton: {
    background: 'white',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#202124',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  },
  infoBox: {
    background: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #dadce0',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  infoText: {
    color: '#5f6368',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0,
  },
  learnMoreLink: {
    color: '#1a73e8',
    textDecoration: 'none',
    marginLeft: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  resourceCard: {
    background: 'white',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    borderLeft: '4px solid #ea4335',
    minHeight: '280px',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid #f1f3f4',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#202124',
    margin: 0,
  },
  cardBody: {
    padding: '20px',
  },
  itemList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f1f3f4',
  },
  itemName: {
    fontSize: '14px',
    color: '#202124',
  },
  statusBadge: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: '500',
  },
  statusActive: {
    backgroundColor: '#e8f5e8',
    color: '#137333',
  },
  statusRunning: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
  },
  statusHealthy: {
    backgroundColor: '#e8f5e8',
    color: '#137333',
  },
  viewAllButton: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#1a73e8',
    fontSize: '14px',
    padding: '12px',
    cursor: 'pointer',
    marginTop: '8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '180px',
  },
  emptyMessage: {
    color: '#5f6368',
    fontSize: '14px',
    marginBottom: '16px',
  },
  addButton: {
    background: '#f8f9fa',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#1a73e8',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  addWidgetCard: {
    background: 'white',
    border: '2px dashed #dadce0',
    borderRadius: '8px',
    minHeight: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  addWidgetContent: {
    textAlign: 'center',
  },
  addWidgetButton: {
    background: 'white',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#202124',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'background-color 0.2s',
  },
  addWidgetDescription: {
    color: '#5f6368',
    fontSize: '12px',
    maxWidth: '200px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #1a73e8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Add CSS animation for spinner
const spinnerCSS = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ResourceCard component
const ResourceCard = ({ type, items = [] }) => {
  const { icon, title, color } = resourceTypes[type];
  
  const getStatusStyle = (status) => {
    const baseStyle = { ...styles.statusBadge };
    if (status === 'Active' || status === 'Healthy') {
      return { ...baseStyle, ...styles.statusActive };
    } else if (status === 'Running') {
      return { ...baseStyle, ...styles.statusRunning };
    }
    return baseStyle;
  };

  return (
    <div 
      style={{
        ...styles.resourceCard,
        borderLeftColor: color,
      }}
    >
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>
          {icon} {title} ({items.length})
        </h3>
      </div>

      <div style={styles.cardBody}>
        {items.length > 0 ? (
          <>
            <ul style={styles.itemList}>
              {items.slice(0, 3).map((item, index) => (
                <li key={index} style={styles.listItem}>
                  <span style={styles.itemName}>{item.name}</span>
                  <span style={getStatusStyle(item.status)}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>

            {items.length > 3 && (
              <button 
                style={styles.viewAllButton}
                onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                View All ({items.length})
              </button>
            )}
          </>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyMessage}>No {title.toLowerCase()} found</p>
            <button 
              style={styles.addButton}
              onMouseEnter={e => e.target.style.backgroundColor = '#e8f4fd'}
              onMouseLeave={e => e.target.style.backgroundColor = '#f8f9fa'}
            >
              + Add New
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
export default function HeadlampOverviewComponent() {
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add spinner animation CSS
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = spinnerCSS;
    document.head.appendChild(styleSheet);

    // Simulate loading
    setTimeout(() => {
      setResources(mockData);
      setLoading(false);
    }, 1000);

    return () => {
      // Cleanup
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={styles.pageTitle}>Overview</h1>
          <button 
            style={styles.refreshButton}
            onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={e => e.target.style.backgroundColor = 'white'}
          >
            🔄 Refresh
          </button>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Gain essential information on your codebase insights. Organize your menu for faster and
            more convenient access to different parts of the portal.
            <a href="#" style={styles.learnMoreLink}>Learn more</a>
          </p>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
        </div>
      ) : (
        <div style={styles.grid}>
          {Object.keys(resourceTypes).map(type => (
            <ResourceCard key={type} type={type} items={resources[type] || []} />
          ))}

          {/* Add Widget Card */}
          <div 
            style={styles.addWidgetCard}
            onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={e => e.target.style.backgroundColor = 'white'}
          >
            <div style={styles.addWidgetContent}>
              <button 
                style={styles.addWidgetButton}
                onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={e => e.target.style.backgroundColor = 'white'}
              >
                + Add Widget
              </button>
              <p style={styles.addWidgetDescription}>
                Customize your dashboard with additional widgets
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}