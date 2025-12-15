import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Clock, User, Video, MapPin,
    MoreVertical, Home, Settings, LogOut, Bell, Search, Plus, Filter,
    Activity, CheckCircle, AlertCircle, X,
    LayoutDashboard, Menu, Stethoscope, Pill, Users, Sparkles, Download
} from 'lucide-react';

// --- API Service Simulation ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const fetchAppointments = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/appointments?${params}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

const updateAppointmentStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update status');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

const AppointmentManagementView = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState('Today');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [doctorFilter, setDoctorFilter] = useState('All Doctors');

    // Stats Calculations
    // Stats Calculations - Updated for new requirements
    const stats = {
        today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
        confirmed: appointments.filter(a => a.status === 'Confirmed').length,
        upcoming: appointments.filter(a => a.status === 'Scheduled').length,
        telemedicine: appointments.filter(a => a.mode === 'Video' || a.mode === 'Video Call').length
    };

    const tabs = ['Upcoming', 'Today', 'Past', 'All'];

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAppointments();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [selectedDate, activeTab, searchQuery, statusFilter, doctorFilter]);

    const loadAppointments = async () => {
        setIsLoading(true);
        let filters = {};
        const todayStr = new Date().toISOString().split('T')[0];

        if (activeTab === 'Today') {
            filters.date = todayStr;
        } else if (activeTab === 'Upcoming') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            filters.start_date = tomorrow.toISOString().split('T')[0];
        } else if (activeTab === 'Past') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            filters.end_date = yesterday.toISOString().split('T')[0];
        } else if (activeTab === 'All') {
            // No filters
        } else {
            // Assume 'Custom' or specific date selection
            filters.date = selectedDate;
        }

        if (searchQuery) filters.search_query = searchQuery;
        if (statusFilter !== 'All Status') filters.status = statusFilter;
        if (doctorFilter !== 'All Doctors') filters.doctor_name = doctorFilter;

        const data = await fetchAppointments(filters);
        setAppointments(data);
        setIsLoading(false);
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        let newStatus = 'Confirmed';
        if (currentStatus === 'Confirmed') newStatus = 'Completed';
        else if (currentStatus === 'Scheduled') newStatus = 'Confirmed';

        const updated = await updateAppointmentStatus(id, newStatus);
        if (updated) {
            setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
        }
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const currentYear = new Date(selectedDate).getFullYear();
    const currentMonth = new Date(selectedDate).getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setActiveTab('Custom');
    };

    // Sidebar Item Component
    const SidebarItem = ({ icon: Icon, active }) => (
        <div className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-400 hover:bg-gray-100 hover:text-indigo-600'}`}>
            <Icon size={22} strokeWidth={2} />
        </div>
    );

    // Enhanced Stat Card Component matching the mockup
    // Enhanced Stat Card Component matching the mockup
    const StatCard = ({ icon: Icon, label, value, color, bg, badge, badgeBg, badgeColor }) => (
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between h-44 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                    <Icon size={26} strokeWidth={2.5} />
                </div>
                {badge && (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${badgeBg} ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8F9FC] font-sans">
            {/* Sidebar */}
            {/* Sidebar - Redesigned & Floating */}
            <nav className="w-20 bg-white flex flex-col items-center py-4 space-y-4 z-20 shadow-lg rounded-[40px] m-4 h-[calc(100vh-2rem)] sticky top-4 overflow-y-auto hide-scrollbar">
                <div className="flex flex-col space-y-4 w-full px-2 items-center">
                    <SidebarItem icon={Search} />
                    <SidebarItem icon={LayoutDashboard} />
                </div>

                <div className="flex flex-col space-y-4 w-full px-2 items-center">
                    <SidebarItem icon={Menu} />
                    <SidebarItem icon={Activity} />
                    <SidebarItem icon={Calendar} active />
                    <SidebarItem icon={Stethoscope} />
                    <SidebarItem icon={Pill} />
                    <SidebarItem icon={Users} />
                </div>

                <div className="flex flex-col space-y-4 w-full px-2 items-center pt-2">
                    <div className="p-3 rounded-full bg-black text-white cursor-pointer shadow-lg hover:bg-gray-800 transition-colors">
                        <Plus size={24} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex flex-col space-y-4 w-full px-2 items-center pt-4">
                    <SidebarItem icon={Sparkles} />
                </div>

                <div className="mt-auto flex flex-col space-y-4 w-full px-2 items-center pb-2">
                    <SidebarItem icon={Settings} />
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden h-screen">
                {/* Header */}
                <header className="h-24 bg-[#F8F9FC] flex items-center justify-between px-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Appointment Management</h1>
                        <p className="text-base text-gray-500 mt-1">Schedule and manage patient appointments</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-indigo-600 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <Download size={18} />
                            <span>Export</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                            <Plus size={18} />

                            <span>New Appointment</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {/* Stats Row - Redesigned */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Calendar}
                            label="Today's Appointments"
                            value={stats.today}
                            color="text-white"
                            bg="bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200"
                            badge="Today"
                            badgeBg="bg-blue-50"
                            badgeColor="text-blue-500"
                        />
                        <StatCard
                            icon={CheckCircle}
                            label="Confirmed Appointments"
                            value={stats.confirmed}
                            color="text-white"
                            bg="bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200"
                            badge="Confirmed"
                            badgeBg="bg-green-50"
                            badgeColor="text-green-600"
                        />
                        <StatCard
                            icon={Clock}
                            label="Upcoming Appointments"
                            value={stats.upcoming}
                            color="text-white"
                            bg="bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-200"
                            badge="Upcoming"
                            badgeBg="bg-indigo-50"
                            badgeColor="text-indigo-600"
                        />
                        <StatCard
                            icon={Video}
                            label="Telemedicine Sessions"
                            value={stats.telemedicine}
                            color="text-white"
                            bg="bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-200"
                            badge="Virtual"
                            badgeBg="bg-purple-50"
                            badgeColor="text-purple-600"
                        />
                    </div>

                    <div className="flex space-x-8 h-[calc(100vh-320px)] min-h-[500px]">
                        {/* Calendar Widget */}
                        {/* Calendar Widget */}
                        <div className="w-[420px] h-fit flex-shrink-0 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col">
                            <h2 className="text-base font-semibold text-gray-500 mb-4">Calendar</h2>

                            {/* Inner Bordered Calendar */}
                            <div className="border border-gray-100 rounded-2xl p-4 mb-2">
                                <div className="flex items-center justify-between mb-4">
                                    <button className="p-1 hover:bg-gray-50 rounded-lg transition-all text-gray-400"><ChevronLeft size={18} /></button>
                                    <span className="text-sm font-bold text-gray-800">
                                        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button className="p-1 hover:bg-gray-50 rounded-lg transition-all text-gray-400"><ChevronRight size={18} /></button>
                                </div>

                                <div className="grid grid-cols-7 gap-y-3 gap-x-1">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                        <div key={d} className="text-center text-xs font-medium text-gray-400 mb-2">{d}</div>
                                    ))}

                                    {daysArray.map(day => {
                                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isSelected = dateStr === selectedDate;

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleDateClick(dateStr)}
                                                className={`
                                                    h-8 w-8 mx-auto rounded-lg flex items-center justify-center text-sm font-medium transition-all
                                                    ${isSelected
                                                        ? 'bg-black text-white shadow-md'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Status Legend */}
                            <div className="flex flex-col space-y-2 px-1 mt-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-gray-500">Confirmed</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-medium text-gray-500">Scheduled</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                                    <span className="text-sm font-medium text-gray-500">Completed</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <span className="text-sm font-medium text-gray-500">Cancelled</span>
                                </div>
                            </div>
                        </div>



                        {/* Appointments List */}
                        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col space-y-4">
                                <div className="flex space-x-1 bg-gray-100/80 p-1.5 rounded-xl w-fit">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Filter Row */}
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search appointments..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 w-full"
                                        />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 pl-4 pr-10 py-2 rounded-xl text-sm text-gray-600 border-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                        >
                                            <option>All Status</option>
                                            <option>Confirmed</option>
                                            <option>Scheduled</option>
                                            <option>Cancelled</option>
                                            <option>Upcoming</option>
                                            <option>Completed</option>
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={doctorFilter}
                                            onChange={(e) => setDoctorFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 pl-4 pr-10 py-2 rounded-xl text-sm text-gray-600 border-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                        >
                                            <option>All Doctors</option>
                                            <option>Dr. Rajesh Kumar</option>
                                            <option>Dr. Priya Sharma</option>
                                            <option>Dr. Smith</option>
                                            <option>Dr. Jones</option>
                                            <option>Dr. Brown</option>
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                                        <p>Loading appointments...</p>
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl m-4">
                                        <Calendar size={48} className="mb-4 text-gray-200" />
                                        <p>No appointments for this date</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.map((apt) => (
                                            <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
                                                {/* Header Section */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                                            <User size={20} strokeWidth={2.5} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-800 mb-1">{apt.name}</h3>
                                                            <div className="flex items-center text-sm text-gray-500 space-x-3 mb-2">
                                                                <div className="flex items-center">
                                                                    <Calendar size={14} className="mr-1.5 text-gray-400" />
                                                                    {apt.date}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Clock size={14} className="mr-1.5 text-gray-400" />
                                                                    {apt.time}
                                                                </div>
                                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                <div>{apt.duration}</div>
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                                <div className="flex items-center">
                                                                    <User size={14} className="mr-1.5 text-gray-400" />
                                                                    {apt.doctorName}
                                                                </div>
                                                                <div className="flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                                                    <MapPin size={12} className="mr-1" />
                                                                    {apt.mode}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5
                                                    ${apt.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                                                            apt.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' :
                                                                apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                                    'bg-gray-50 text-gray-600'
                                                        }`}>
                                                        {apt.status === 'Confirmed' && <CheckCircle size={12} />}
                                                        <span>{apt.status}</span>
                                                    </span>
                                                </div>

                                                {/* Content Box */}
                                                <div className="bg-blue-50/30 rounded-xl p-5 mb-5 border border-blue-50/50">
                                                    <div className="flex items-center space-x-2 mb-3 text-gray-700 font-semibold text-sm">
                                                        <Activity size={16} className="text-blue-500" />
                                                        <span>Consultation</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium text-gray-700">Reason:</span> {apt.reason || 'General Consultation'}
                                                        </p>
                                                        {apt.note && (
                                                            <p className="text-sm text-gray-500 italic border-t border-blue-100/50 mt-2 pt-2">
                                                                Note: {apt.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Footer Actions */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                    <div className="flex items-center space-x-6">
                                                        {apt.phone && (
                                                            <div className="flex items-center text-sm text-gray-400">
                                                                <div className="mr-2"><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                                                                {apt.phone}
                                                            </div>
                                                        )}
                                                        {apt.email && (
                                                            <div className="flex items-center text-sm text-gray-400">
                                                                <div className="mr-2"><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                                                                {apt.email}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt.id, apt.status)}
                                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Mark as Confirmed/Completed"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};





export default AppointmentManagementView;
