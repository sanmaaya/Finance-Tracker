import React, { useEffect } from 'react';
import PremiumDashboard from '../components/dashboard/PremiumDashboard';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme('premium-dark');
    }, [setTheme]);

    return (
        <div className="dashboard-page premium-mode">
            <PremiumDashboard />
        </div>
    );
};

export default Dashboard;
