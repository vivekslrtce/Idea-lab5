import { Complaint, User } from '../types';
import { initializeActivityLogs } from './activityLogger';

export const DEMO_CITIZEN: User = {
  id: 'usr-citizen-01',
  name: 'Rahul Sharma',
  email: 'citizen@example.com',
  mobile: '+91 9876543210',
  role: 'citizen'
};

export const DEMO_ADMIN: User = {
  id: 'usr-admin-01',
  name: 'Admin Office (Civic Auth)',
  email: 'admin@gov.in',
  mobile: '+91 9000000000',
  role: 'admin'
};

/**
 * Checks whether an email address has a valid @gov.in domain.
 * Accepts any name before @, but domain must be @gov.in or a subdomain of gov.in
 */
export const isGovInEmail = (emailStr: string): boolean => {
  if (!emailStr) return false;
  const trimmed = emailStr.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0) return false;
  const localPart = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  if (!localPart) return false;
  return domain === 'gov.in' || domain.endsWith('.gov.in');
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'UFR-2026-0001',
    userId: 'usr-citizen-01',
    userName: 'Rahul Sharma',
    userMobile: '+91 9876543210',
    title: 'Street light not working near Metro Gate 2',
    department: 'Street Lights',
    problemType: 'Broken Lamp / Outage',
    priority: 'High',
    address: 'Plot 42, Metro Station Road',
    area: 'Connaught Sector 4',
    city: 'Metropolis',
    landmark: 'Opposite Central Park Gate 2',
    latitude: 28.6139,
    longitude: 77.2090,
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=600',
    description: 'The street light pole #SL-104 has been flickering and completely off for the last 3 nights. The road remains pitch dark making it unsafe for pedestrians.',
    status: 'In Progress',
    createdAt: '2026-08-08T10:30:00Z',
    updatedAt: '2026-08-09T14:20:00Z',
    statusHistory: [
      { status: 'Reported', timestamp: '2026-08-08T10:30:00Z', note: 'Complaint lodged by citizen.' },
      { status: 'Under Review', timestamp: '2026-08-08T16:00:00Z', note: 'Assigned to Electrical Maintenance Team B.' },
      { status: 'In Progress', timestamp: '2026-08-09T14:20:00Z', note: 'Electrician dispatched with replacement LED fixture.' }
    ],
    adminRemark: 'Inspection team dispatched. LED ballast replacement scheduled.'
  },
  {
    id: 'UFR-2026-0002',
    userId: 'usr-citizen-01',
    userName: 'Rahul Sharma',
    userMobile: '+91 9876543210',
    title: 'Major water pipeline leak in main market',
    department: 'Water Supply',
    problemType: 'Pipe Leakage',
    priority: 'High',
    address: 'Shop 12, Market Complex',
    area: 'Green Park Phase 1',
    city: 'Metropolis',
    landmark: 'Near City Bank ATM',
    latitude: 28.6200,
    longitude: 77.2150,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600',
    description: 'Underground water pipe leaking heavily. Water is flooding the road in front of shop #12 causing heavy wastage and traffic slowdown.',
    status: 'Reported',
    createdAt: '2026-08-10T08:15:00Z',
    updatedAt: '2026-08-10T08:15:00Z',
    statusHistory: [
      { status: 'Reported', timestamp: '2026-08-10T08:15:00Z', note: 'Complaint registered successfully.' }
    ]
  },
  {
    id: 'UFR-2026-0003',
    userId: 'usr-citizen-01',
    userName: 'Rahul Sharma',
    userMobile: '+91 9876543210',
    title: 'Deep pothole on Main Ring Road',
    department: 'Roads',
    problemType: 'Pothole / Road Surface Damage',
    priority: 'Medium',
    address: 'Ring Road Crossing, Near Flyover',
    area: 'Industrial Zone B',
    city: 'Metropolis',
    landmark: 'Beside Bus Depot',
    latitude: 28.6050,
    longitude: 77.1980,
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600',
    description: 'A large pothole roughly 2 feet wide has formed on the left lane. Vehicles are braking suddenly causing mini traffic bottlenecks.',
    status: 'Under Review',
    createdAt: '2026-08-09T11:00:00Z',
    updatedAt: '2026-08-09T17:30:00Z',
    statusHistory: [
      { status: 'Reported', timestamp: '2026-08-09T11:00:00Z', note: 'Reported by citizen.' },
      { status: 'Under Review', timestamp: '2026-08-09T17:30:00Z', note: 'Public Works Department reviewing road maintenance batch.' }
    ],
    adminRemark: 'Scheduled for cold-mix asphalt patch work on Friday night.'
  },
  {
    id: 'UFR-2026-0004',
    userId: 'usr-citizen-02',
    userName: 'Priya Verma',
    userMobile: '+91 9123456789',
    title: 'Overflowing community garbage dumpster',
    department: 'Waste Management',
    problemType: 'Uncollected Trash / Overflow',
    priority: 'Medium',
    address: 'Block C Community Dumpster',
    area: 'Sunrise Apartments',
    city: 'Metropolis',
    landmark: 'Behind Club House',
    latitude: 28.6310,
    longitude: 77.2210,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    description: 'Garbage collection truck has not arrived for 3 days. Dumpster is overflowing onto the pavement causing foul odor and unhygienic conditions.',
    status: 'Resolved',
    createdAt: '2026-08-05T09:00:00Z',
    updatedAt: '2026-08-06T15:45:00Z',
    resolvedAt: '2026-08-06T15:45:00Z',
    statusHistory: [
      { status: 'Reported', timestamp: '2026-08-05T09:00:00Z', note: 'Submitted.' },
      { status: 'Under Review', timestamp: '2026-08-05T12:00:00Z', note: 'Sanitation Inspector notified.' },
      { status: 'In Progress', timestamp: '2026-08-06T08:00:00Z', note: 'Compactor truck deployed.' },
      { status: 'Resolved', timestamp: '2026-08-06T15:45:00Z', note: 'Bin cleared and surrounding area disinfected.' }
    ],
    adminRemark: 'Cleared by Sanitation Crew #4. Area disinfected with bleaching powder.'
  },
  {
    id: 'UFR-2026-0005',
    userId: 'usr-citizen-01',
    userName: 'Rahul Sharma',
    userMobile: '+91 9876543210',
    title: 'Clogged storm drain causing street waterlogging',
    department: 'Drainage',
    problemType: 'Blocked Drain / Sewage Overflow',
    priority: 'High',
    address: 'Street 9, Near School Gate',
    area: 'Vasant Vihar',
    city: 'Metropolis',
    landmark: 'Opposite Model High School',
    latitude: 28.5900,
    longitude: 77.2050,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&q=80&w=600',
    description: 'Heavy rain runoff is blocked due to plastic debris accumulated inside the storm drain grille. Water is stagnating on the school access road.',
    status: 'Resolved',
    createdAt: '2026-08-04T14:10:00Z',
    updatedAt: '2026-08-05T11:20:00Z',
    resolvedAt: '2026-08-05T11:20:00Z',
    statusHistory: [
      { status: 'Reported', timestamp: '2026-08-04T14:10:00Z', note: 'Reported.' },
      { status: 'Under Review', timestamp: '2026-08-04T16:00:00Z', note: 'Drainage ward officer assigned.' },
      { status: 'In Progress', timestamp: '2026-08-05T09:00:00Z', note: 'Suction jetting machine operated.' },
      { status: 'Resolved', timestamp: '2026-08-05T11:20:00Z', note: 'Grille cleared and flow restored.' }
    ],
    adminRemark: 'Silt and plastic waste removed from inlet duct.'
  },
  {
    id: 'UFR-2026-0006',
    userId: 'usr-citizen-03',
    userName: 'Amit Kumar',
    userMobile: '+91 9988776655',
    title: 'Sparks emitting from electric pole transformer',
    department: 'Electricity',
    problemType: 'Sparking / Transformer Fault',
    priority: 'High',
    address: 'Pole #E-88, Main Chowk',
    area: 'Civil Lines',
    city: 'Metropolis',
    landmark: 'Near Bus Stand',
    latitude: 28.6400,
    longitude: 77.2300,
    description: 'Transformer on Pole E-88 is producing loud crackling noises and intermittent sparking during peak evening loads.',
    status: 'In Progress',
    createdAt: '2026-08-10T19:30:00Z',
    updatedAt: '2026-08-11T00:15:00Z',
    statusHistory: [
      { status: 'Reported', timestamp: '2026-08-10T19:30:00Z', note: 'Emergency electrical alert submitted.' },
      { status: 'Under Review', timestamp: '2026-08-10T20:00:00Z', note: 'Power Grid Control Room notified.' },
      { status: 'In Progress', timestamp: '2026-08-11T00:15:00Z', note: 'Lineman team on site repairing loose jumper connector.' }
    ],
    adminRemark: 'Urgent repair team on site. Power line temporarily isolated for safe fix.'
  }
];

export function initializeStorage() {
  if (!localStorage.getItem('ufr_complaints')) {
    localStorage.setItem('ufr_complaints', JSON.stringify(INITIAL_COMPLAINTS));
  }
  if (!localStorage.getItem('ufr_user')) {
    localStorage.setItem('ufr_user', JSON.stringify(DEMO_CITIZEN));
  }
  if (!localStorage.getItem('ufr_registered_users')) {
    localStorage.setItem('ufr_registered_users', JSON.stringify([DEMO_CITIZEN, DEMO_ADMIN]));
  }
  initializeActivityLogs();
}
