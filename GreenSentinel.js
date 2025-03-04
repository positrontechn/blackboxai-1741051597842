import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Bell, AlertTriangle, Award, Menu, Bug, Axe, ThermometerSun, Users, Leaf, Heart, MessageCircle, BookOpen, Shield, Share2, Crosshair } from 'lucide-react';
import logo from '../logo-GreenSentinel-without-backgroung.png';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom location marker icon
const locationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

function LocationMarker({ onLocationFound }) {
  const map = useMap();

  useEffect(() => {
    map.locate();
    
    map.on('locationfound', (e) => {
      onLocationFound(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });

    return () => {
      map.off('locationfound');
    };
  }, [map, onLocationFound]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
  });
  return null;
}

function LocationButton({ currentLocation }) {
  const map = useMap();
  
  return (
    <button 
      onClick={() => currentLocation && map.flyTo([currentLocation.lat, currentLocation.lng], 15)}
      className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg"
    >
      <Crosshair size={24} className="text-emerald-500" />
    </button>
  );
}

function MapContent({ currentLocation, markers, handleMapClick, handleLocationFound, handleQuickReport, showQuickReport, setShowQuickReport, reportTypes }) {
  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onMapClick={handleMapClick} />
      <LocationMarker onLocationFound={handleLocationFound} />
      
      {/* Current location marker */}
      {currentLocation && (
        <Marker position={[currentLocation.lat, currentLocation.lng]} icon={locationIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">Your Location</h3>
              <p className="text-xs text-gray-500">
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Issue markers */}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold capitalize">{marker.type}</h3>
              <p className="text-sm text-gray-600">{marker.description}</p>
              <div className="text-xs text-gray-500 mt-1">
                <p>Severity: {marker.severity}</p>
                <p>Area: {marker.area}</p>
                <p>Status: {marker.status}</p>
                <p>Reported: {new Date(marker.date).toLocaleString()}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <LocationButton currentLocation={currentLocation} />

      {/* Quick Report Panel */}
      <div className="absolute bottom-20 left-0 right-0 px-4 z-[1000]">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Quick Report</h3>
            <button 
              onClick={() => setShowQuickReport(!showQuickReport)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showQuickReport ? 'Hide' : 'Show'}
            </button>
          </div>
          {showQuickReport && (
            <div className="grid grid-cols-3 gap-2">
              {reportTypes.map(type => (
                <button 
                  key={type.id}
                  onClick={() => handleQuickReport(type.id)}
                  className={`${type.color} text-white p-3 rounded-lg flex flex-col items-center`}
                >
                  <type.icon size={20} />
                  <span className="text-xs mt-1">{type.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const GreenSentinel = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [reportType, setReportType] = useState(null);
  const [mapCenter] = useState([31.7917, -7.0926]);
  const [zoom] = useState(6);
  const [markers, setMarkers] = useState([]);
  const [userPoints, setUserPoints] = useState(350);
  const [level, setLevel] = useState(5);
  const [reportDescription, setReportDescription] = useState('');
  const [reportSeverity, setReportSeverity] = useState('medium');
  const [reportArea, setReportArea] = useState('small');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showQuickReport, setShowQuickReport] = useState(true);

  const reportTypes = [
    { id: 'fire', icon: AlertTriangle, label: 'Fire', color: 'bg-red-500', points: 50, verificationTime: 2 },
    { id: 'logging', icon: Axe, label: 'Illegal Logging', color: 'bg-orange-500', points: 40, verificationTime: 4 },
    { id: 'disease', icon: Bug, label: 'Tree Disease', color: 'bg-yellow-500', points: 30, verificationTime: 3 },
    { id: 'pollution', icon: ThermometerSun, label: 'Pollution', color: 'bg-purple-500', points: 45, verificationTime: 3 },
    { id: 'hunting', icon: Shield, label: 'Illegal Hunting', color: 'bg-blue-500', points: 40, verificationTime: 4 },
    { id: 'waste', icon: Leaf, label: 'Waste Dumping', color: 'bg-emerald-500', points: 35, verificationTime: 2 }
  ];

  const calculateLevel = (points) => {
    if (points < 100) return 1;
    if (points < 250) return 2;
    if (points < 500) return 3;
    if (points < 1000) return 4;
    return 5;
  };

  const addPoints = (points, reportType) => {
    const selectedReport = reportTypes.find(t => t.id === reportType);
    if (!selectedReport) return;

    // Start verification process
    alert(`Thank you for your report! It will be verified within ${selectedReport.verificationTime} hours. You will receive ${points} points after verification.`);
    
    // Simulate verification process (in real app, this would be handled by a backend)
    setTimeout(() => {
      const newPoints = userPoints + points;
      setUserPoints(newPoints);
      const newLevel = calculateLevel(newPoints);
      
      if (newLevel !== level) {
        setLevel(newLevel);
        alert(`Verification complete! Congratulations! You've reached Level ${newLevel} and earned ${points} points!`);
      } else {
        alert(`Verification complete! You've earned ${points} points!`);
      }
    }, selectedReport.verificationTime * 1000); // Using seconds instead of hours for demo
  };

  const handleLocationFound = (latlng) => {
    setCurrentLocation(latlng);
  };

  const handleQuickReport = (type) => {
    if (!currentLocation) {
      alert('Please wait for your location to be detected');
      return;
    }

    const selectedReportType = reportTypes.find(t => t.id === type);
    const newMarker = {
      position: [currentLocation.lat, currentLocation.lng],
      type: type,
      description: `Quick ${selectedReportType.label} report`,
      severity: 'medium',
      area: 'small',
      date: new Date().toISOString(),
      status: 'pending'
    };

    setMarkers([...markers, newMarker]);
    addPoints(selectedReportType.points, type);
  };

  const handleReport = () => {
    if (!reportType || !reportDescription || !selectedLocation) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedReportType = reportTypes.find(t => t.id === reportType);
    const newMarker = {
      position: [selectedLocation.lat, selectedLocation.lng],
      type: reportType,
      description: reportDescription,
      severity: reportSeverity,
      area: reportArea,
      date: new Date().toISOString(),
      status: 'pending'
    };

    setMarkers([...markers, newMarker]);
    addPoints(selectedReportType.points, reportType);
    
    // Reset form
    setReportType(null);
    setReportDescription('');
    setReportSeverity('medium');
    setReportArea('small');
    setSelectedLocation(null);
    setActiveTab('map');
  };

  const handleMapClick = (e) => {
    if (activeTab === 'report') {
      setSelectedLocation(e.latlng);
    }
  };

  const renderMap = () => (
    <div className="relative h-[calc(100vh-128px)]">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapContent
          currentLocation={currentLocation}
          markers={markers}
          handleMapClick={handleMapClick}
          handleLocationFound={handleLocationFound}
          handleQuickReport={handleQuickReport}
          showQuickReport={showQuickReport}
          setShowQuickReport={setShowQuickReport}
          reportTypes={reportTypes}
        />
      </MapContainer>
    </div>
  );

  const renderHome = () => (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Welcome Banner */}
      <div className="bg-emerald-500 text-white p-6 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Green Sentinel Logo" className="h-8 w-auto" />
            <h2 className="text-2xl font-bold">Welcome Guardian!</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Shield className="text-yellow-300" size={24} />
              <div>
                <p className="text-sm opacity-90">Protection Level</p>
                <p className="text-xl font-bold">Level {level}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 opacity-10">
          <Leaf size={120} />
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'learn', icon: BookOpen, label: 'Educational Resources', count: 12 },
          { id: 'community', icon: Users, label: 'Community Programs', count: 5 },
          { id: 'achievements', icon: Award, label: 'My Achievements', count: 8 }
        ].map(section => (
          <div key={section.id} className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${section.id === 'learn' ? 'bg-emerald-100' : section.id === 'community' ? 'bg-blue-100' : 'bg-yellow-100'} rounded-xl`}>
                <section.icon size={20} className={section.id === 'learn' ? 'text-emerald-600' : section.id === 'community' ? 'text-blue-600' : 'text-yellow-600'} />
              </div>
              <div>
                <h3 className="font-medium text-sm">{section.label}</h3>
                <p className="text-xs text-gray-500">{section.count} items</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="font-bold">Recent Activity</h3>
        <div className="space-y-2">
          {[
            { id: 1, title: 'Fire Alert Reported', time: '2h ago', type: 'alert', icon: AlertTriangle, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
            { id: 2, title: 'Joined Clean-up Event', time: '1d ago', type: 'event', icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
            { id: 3, title: 'Completed Tree Guide', time: '2d ago', type: 'education', icon: BookOpen, iconBg: 'bg-green-100', iconColor: 'text-green-600' }
          ].map((activity) => (
            <div key={activity.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activity.iconBg}`}>
                  <activity.icon size={20} className={activity.iconColor} />
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <Share2 size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Report Issue</h2>
      
      {/* Issue Type Selection */}
      <div className="grid grid-cols-3 gap-3">
        {reportTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`${type.color} ${reportType === type.id ? 'ring-2 ring-offset-2' : ''} 
              text-white p-4 rounded-xl flex flex-col items-center`}
          >
            <type.icon size={24} />
            <span className="text-xs mt-2">{type.label}</span>
            <span className="text-xs mt-1">+{type.points}pts</span>
          </button>
        ))}
      </div>

      {reportType && (
        <>
          {/* Photo Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <Camera size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Add Photos (Optional)</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full p-3 border rounded-xl h-24"
              placeholder="Describe what you observe..."
            />
          </div>

          {/* Severity and Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={reportSeverity}
                onChange={(e) => setReportSeverity(e.target.value)}
                className="w-full p-3 border rounded-xl"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <select
                value={reportArea}
                onChange={(e) => setReportArea(e.target.value)}
                className="w-full p-3 border rounded-xl"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className={`bg-gray-50 p-4 rounded-xl flex items-center justify-between ${selectedLocation ? 'bg-emerald-50' : ''}`}>
            <div className="flex items-center gap-3">
              <MapPin size={24} className={selectedLocation ? 'text-emerald-500' : 'text-gray-400'} />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-600">
                  {selectedLocation 
                    ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
                    : 'Click on the map to set location'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleReport}
            className="w-full bg-emerald-500 text-white py-4 rounded-xl font-medium"
          >
            Submit Report
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-emerald-500 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Menu size={24} />
            <div className="flex items-center gap-2">
              <img src={logo} alt="Green Sentinel Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold">GreenSentinel</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={24} />
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-medium">{level}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'report' && renderReport()}
      </main>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100">
        <div className="flex justify-around py-4">
          {[
            { id: 'home', icon: Heart, label: 'Home' },
            { id: 'map', icon: MapPin, label: 'Map' },
            { id: 'report', icon: Camera, label: 'Report' },
            { id: 'chat', icon: MessageCircle, label: 'Chat' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 ${
                activeTab === item.id ? 'text-emerald-500' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GreenSentinel;
