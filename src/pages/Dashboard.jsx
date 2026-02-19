import DashboardLayout from '../components/dashboard/Dashboard';
import './Dashboard.css';

const Dashboard = () => {

    // Theme is now managed globally by useTheme

    return (
        <div className="dashboard-page premium-mode">
            <DashboardLayout />
        </div>
    );
};

export default Dashboard;
