import React from 'react';
import { BiteProvider, useBite } from './context/BiteContext';
import { CustomerApp } from './apps/CustomerApp';
import { PosApp } from './apps/PosApp';
import { KdsApp } from './apps/KdsApp';
import { DriverApp } from './apps/DriverApp';
import { AdminApp } from './apps/AdminApp';
import { ManagerApp } from './apps/ManagerApp';
import { Store, Monitor, Truck, Users, LayoutDashboard, ShoppingBag, Globe, LogOut } from 'lucide-react';

const Hub = () => {
  const { setCurrentModule, setLanguage, language, t } = useBite();

  const apps = [
    { id: 'customer', name: t('customer_app'), icon: <ShoppingBag size={32} />, color: 'bg-orange-500' },
    { id: 'pos', name: t('pos_app'), icon: <Store size={32} />, color: 'bg-emerald-600' },
    { id: 'kds', name: t('kds_app'), icon: <Monitor size={32} />, color: 'bg-blue-600' },
    { id: 'driver', name: t('driver_app'), icon: <Truck size={32} />, color: 'bg-indigo-600' },
    { id: 'admin', name: t('admin_app'), icon: <Users size={32} />, color: 'bg-slate-700' },
    { id: 'manager', name: t('manager_app'), icon: <LayoutDashboard size={32} />, color: 'bg-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">BiteOS<span className="text-orange-500">.</span></h1>
        <p className="text-slate-400 text-lg">{t('welcome')}</p>
        
        <div className="mt-6 inline-flex bg-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setLanguage('pt')} 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${language === 'pt' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Português
          </button>
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${language === 'en' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            English
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {apps.map(app => (
          <button 
            key={app.id}
            onClick={() => setCurrentModule(app.id)}
            className={`${app.color} group relative overflow-hidden p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center gap-4 text-white`}
          >
            <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            {app.icon}
            <span className="font-bold text-xl relative z-10">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AppShell = () => {
  const { currentModule, setCurrentModule, t } = useBite();

  if (!currentModule) return <Hub />;

  const getComponent = () => {
    switch(currentModule) {
      case 'customer': return <CustomerApp />;
      case 'pos': return <PosApp />;
      case 'kds': return <KdsApp />;
      case 'driver': return <DriverApp />;
      case 'admin': return <AdminApp />;
      case 'manager': return <ManagerApp />;
      default: return <Hub />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-900 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <button onClick={() => setCurrentModule(null)} className="hover:bg-slate-800 p-2 rounded-lg transition-colors">
              <div className="font-bold text-xl tracking-tighter">BiteOS<span className="text-orange-500">.</span></div>
           </button>
           <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>
           <span className="text-slate-400 text-sm hidden md:block uppercase tracking-wider font-semibold">
             {t(`${currentModule}_app`)}
           </span>
        </div>
        
        <button onClick={() => setCurrentModule(null)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <LogOut size={18} />
          <span className="hidden md:inline">{t('logout')}</span>
        </button>
      </header>
      <main className="flex-1 overflow-hidden relative">
        {getComponent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <BiteProvider>
      <AppShell />
    </BiteProvider>
  );
}

export default App;
