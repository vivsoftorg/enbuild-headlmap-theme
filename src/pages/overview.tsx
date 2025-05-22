import { useState, useEffect } from 'react';

// Resource types and their icons
const resourceTypes = {
  codebases: {
    icon: '📁',
    title: 'Codebases',
    path: '/codebases',
    color: '#4A6FDC',
  },
  branches: {
    icon: '🔀',
    title: 'Branches',
    path: '/branches',
    color: '#6B48BF',
  },
  pipelines: {
    icon: '🔄',
    title: 'Pipelines',
    path: '/pipelines',
    color: '#3AA675',
  },
  deployments: {
    icon: '🚀',
    title: 'Deployment Flows',
    path: '/deployment-flows',
    color: '#DF4A37',
  },
  environments: {
    icon: '☁️',
    title: 'Environments',
    path: '/environments',
    color: '#F5A623',
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

// ResourceCard component
const ResourceCard = ({ type, items = [] }) => {
  const { icon, title, color } = resourceTypes[type];

  return (
    <div
      className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden"
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">{icon}</span>
          <h3 className="text-lg font-medium">
            {title} ({items.length})
          </h3>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        <div className="mt-2">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
            >
              <span className="text-sm">{item.name}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'Active' || item.status === 'Healthy'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'Running'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}

          {items.length > 3 && (
            <button className="w-full text-sm text-blue-600 mt-2 p-1 hover:bg-blue-50 rounded">
              View All ({items.length})
            </button>
          )}

          {items.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No {title.toLowerCase()} found</p>
              <button className="mt-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                + Add New
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
export default function OverviewDemo() {
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setResources(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-gray-50 p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">📊</span>
          <h1 className="text-2xl font-bold">Overview</h1>
        </div>

        <button className="flex items-center text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">
          <span className="mr-1">🔄</span> Refresh
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <p className="text-gray-700">
          Gain essential information on your codebase insights. Organize your menu for faster and
          more convenient access to different parts of the portal.
          <button className="ml-2 text-blue-600 text-sm underline">Learn more</button>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(resourceTypes).map(type => (
            <ResourceCard key={type} type={type} items={resources[type] || []} />
          ))}

          <div className="w-full border border-dashed border-gray-300 rounded-lg flex justify-center items-center p-6 bg-gray-50 hover:bg-gray-100">
            <div className="text-center">
              <button className="mb-2 border border-gray-300 rounded px-3 py-1 hover:bg-white">
                + Add Widget
              </button>
              <p className="text-gray-500 text-sm">
                Customize your dashboard with additional widgets
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
