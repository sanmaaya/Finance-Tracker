import React from 'react';
import PremiumDashboard from '../components/dashboard/PremiumDashboard';
import './Dashboard.css';

const Dashboard: React.FC = () => {

    // Theme is now managed globally by useTheme

    return (
        <div className="dashboard-page premium-mode">
            <PremiumDashboard />
        </div>
    );
};

export default Dashboard;
