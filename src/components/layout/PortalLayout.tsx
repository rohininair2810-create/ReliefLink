import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export interface SidebarItem {
  label: string;
  path?: string;
  to?: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface PortalLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  portalName?: string;
  portalLabel?: string;
  portalColor?: string;
  portalIcon?: React.ReactNode;
  currentPath?: string;
}

const SIDEBAR_BG = '#172D40';
const SIDEBAR_TEXT = 'rgba(147,197,253,1)';
const ACTIVE_BG = 'rgba(255,255,255,0.12)';
const PAGE_BG = '#F4F6F8';
const SIDEBAR_WIDTH = 250;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function PortalLayout({
  children,
  sidebarItems,
  portalName,
  portalLabel,
  portalColor = '#197C78',
  portalIcon = <Shield size={20} />,
  currentPath,
}: PortalLayoutProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = currentPath || location.pathname;
  const effectivePortalName = portalLabel || portalName || 'ReliefLink Portal';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [activePath, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activePage =
    sidebarItems.find((item) => (item.path || item.to) === activePath)?.label ??
    effectivePortalName;

  const SidebarContent = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: SIDEBAR_BG,
        width: SIDEBAR_WIDTH,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Branding */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: portalColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {portalIcon}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              color: '#ffffff',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {effectivePortalName}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(147,197,253,0.7)',
              marginTop: 2,
            }}
          >
            ReliefLink Platform
          </div>
        </div>

        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: SIDEBAR_TEXT,
              padding: 4,
            }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 10px',
        }}
      >
        {sidebarItems.map((item) => {
          const itemTarget = item.path || item.to || '#';
          const isActive = activePath === itemTarget;
          return (
            <Link
              key={itemTarget}
              to={itemTarget}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '9px 12px',
                borderRadius: 8,
                marginBottom: 3,
                textDecoration: 'none',
                background: isActive ? ACTIVE_BG : 'transparent',
                color: isActive ? '#ffffff' : SIDEBAR_TEXT,
                fontWeight: isActive ? 600 : 400,
                fontSize: 13.5,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <span
                style={{
                  color: isActive ? '#ffffff' : 'rgba(147,197,253,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  style={{
                    background: '#D94B45',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 9999,
                    padding: '2px 7px',
                    lineHeight: 1,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile & Logout */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: portalColor,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {currentUser ? getInitials(currentUser.name) : 'U'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentUser?.name || 'Authorized User'}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(147,197,253,0.7)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentUser?.email || 'portal@relieflink.org'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(147,197,253,0.7)',
            padding: 6,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: PAGE_BG }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{ width: SIDEBAR_WIDTH, flexShrink: 0, height: '100%' }}>
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Drawer Overlay */}
      {isMobile && sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
          }}
        >
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1000, height: '100%' }}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Header */}
        <header
          style={{
            height: 60,
            background: '#ffffff',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 6,
                  color: '#172D40',
                  display: 'flex',
                }}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            )}
            <h1
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 18,
                fontWeight: 700,
                color: '#172D40',
                margin: 0,
              }}
            >
              {activePage}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(229, 160, 75, 0.12)',
                color: '#B7791F',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              DEMO ENVIRONMENT
            </div>

            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: portalColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {currentUser ? getInitials(currentUser.name) : 'U'}
            </div>
          </div>
        </header>

        {/* Scrollable page body */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            background: PAGE_BG,
            padding: isMobile ? '16px' : '24px',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;
