import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Map, 
  User, 
  Calendar, 
  Settings, 
  MessageSquare, 
  BookOpen,
  FileText,
  Users,
  Shield,
  Globe,
  Plane
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  matchSearch?: (search: string) => boolean;
}

const SidebarLink = ({ to, icon, label, end = false, matchSearch }: SidebarLinkProps) => {
  const { theme } = useTheme();
  const location = useLocation();
  
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => {
        const active = matchSearch ? matchSearch(location.search) : isActive;
        return cn(
          "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          active
            ? "bg-twende-teal/10 text-twende-teal dark:bg-twende-skyblue/10 dark:text-twende-skyblue font-medium"
            : "text-gray-700 dark:text-gray-300"
        );
      }}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

const DashboardSidebar = () => {
  const { isAdmin, isLoading } = useRole();
  
  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 h-screen border-r dark:border-gray-800 fixed top-16 left-0 overflow-y-auto pb-20">
      <nav className="p-4 space-y-1">
        <SidebarLink to="/dashboard" icon={<Home size={18} />} label="Dashboard" end />
        
        {/* Request Service link (new service request = services tab) */}
        <SidebarLink
          to="/dashboard?tab=services"
          icon={<FileText size={18} />}
          label="Request Service"
          end
          matchSearch={search => new URLSearchParams(search).get('tab') === 'services'}
        />

        {/* Common links for all users */}
        <SidebarLink to="/destination" icon={<Map size={18} />} label="Destinations" />
        <SidebarLink to="/trip" icon={<Calendar size={18} />} label="My Trips" />
        <SidebarLink
          to="/dashboard?tab=messages"
          icon={<MessageSquare size={18} />}
          label="Messages"
          matchSearch={search => new URLSearchParams(search).get('tab') === 'messages'}
        />
        {/* Flights tab within dashboard */}
        <SidebarLink
          to="/dashboard?tab=flights"
          icon={<Plane size={18} />}
          label="Flights"
          matchSearch={search => new URLSearchParams(search).get('tab') === 'flights'}
        />
        
        {/* Admin specific links */}
        {!isLoading && isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Admin
              </div>
            </div>
            <SidebarLink to="/admin" icon={<Shield size={18} />} label="Admin Dashboard" end />
            <SidebarLink to="/admin/users" icon={<Users size={18} />} label="User Management" />
            <SidebarLink to="/admin/travel-management" icon={<Globe size={18} />} label="Travel Management" />
            <SidebarLink to="/admin/service-requests" icon={<FileText size={18} />} label="Service Requests" />
          </>
        )}
        
        {/* Resources section */}
        <div className="pt-4 pb-2">
          <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Resources
          </div>
        </div>
        <SidebarLink
          to="/dashboard?tab=assistant"
          icon={<BookOpen size={18} />}
          label="Travel Assistant"
          matchSearch={search => new URLSearchParams(search).get('tab') === 'assistant'}
        />
        <SidebarLink to="/profile" icon={<User size={18} />} label="Profile Settings" />
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
