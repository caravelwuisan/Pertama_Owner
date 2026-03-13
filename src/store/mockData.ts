import type { User, Project, Camera, Invoice, TimelineMilestone, DailyUpdate } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'John Smith', role: 'owner', projectId: 'p1' },
  { id: 'u2', name: 'Admin User', role: 'admin' },
];

export const mockProject: Project = {
  id: 'p1',
  name: 'Villa Uluwatu 01',
  completionPercentage: 65,
  nextMilestone: 'Roof Installation',
  address: 'Jalan Uluwatu, Bali'
};

export const mockCameras: Camera[] = [
  { id: 'c1', projectId: 'p1', name: 'Pool Area', streamUrl: 'https://images.unsplash.com/photo-1576013551627-11971f3f8f36?auto=format&fit=crop&q=80', status: 'online' },
  { id: 'c2', projectId: 'p1', name: 'Living Room', streamUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80', status: 'online' },
  { id: 'c3', projectId: 'p1', name: 'Garden', streamUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&q=80', status: 'online' }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'i1', projectId: 'p1', month: 'January', year: 2024,
    amount: 25000, status: 'Paid', description: 'Foundation & Initial Structural Work',
    date: '2024-01-15'
  },
  {
    id: 'i2', projectId: 'p1', month: 'February', year: 2024,
    amount: 35000, status: 'Pending', description: 'Wall construction & Plumbing rough-in',
    date: '2024-02-15'
  }
];

export const mockTimeline: TimelineMilestone[] = [
  {
    id: 't1', projectId: 'p1', title: 'Land preparation', date: '2023-11-01',
    description: 'Clearing the land and preparing for foundation.',
    completionPercentage: 100, photos: [], status: 'completed'
  },
  {
    id: 't2', projectId: 'p1', title: 'Foundations', date: '2023-12-15',
    description: 'Piling and concrete foundation work.',
    completionPercentage: 100, photos: [], status: 'completed'
  },
  {
    id: 't3', projectId: 'p1', title: 'Structure', date: '2024-02-28',
    description: 'Concrete framing and blockwork for all floors.',
    completionPercentage: 60, photos: [], status: 'in-progress'
  },
  {
    id: 't4', projectId: 'p1', title: 'Roof', date: '2024-04-15',
    description: 'Timber frame and roofing materials.',
    completionPercentage: 0, photos: [], status: 'pending'
  },
  {
    id: 't5', projectId: 'p1', title: 'Interior work', date: '2024-06-01',
    description: 'MEP, drywall, and interior partitions.',
    completionPercentage: 0, photos: [], status: 'pending'
  },
  {
    id: 't6', projectId: 'p1', title: 'Finishing', date: '2024-08-01',
    description: 'Tiling, painting, and fitting fixtures.',
    completionPercentage: 0, photos: [], status: 'pending'
  },
  {
    id: 't7', projectId: 'p1', title: 'Delivery', date: '2024-09-30',
    description: 'Final inspection and handover.',
    completionPercentage: 0, photos: [], status: 'pending'
  }
];

export const mockUpdates: DailyUpdate[] = [
  {
    id: 'u1', projectId: 'p1', date: '2024-02-28T09:00:00Z',
    text: 'Concrete poured for the pool structure. Weather conditions were optimal today. Curing process has started.',
    author: 'Pak Wayan (Site Manager)',
    photos: ['/latest_setup.jpg']
  },
  {
    id: 'u2', projectId: 'p1', date: '2024-02-27T14:30:00Z',
    text: 'Electric wiring installation started on the ground floor. Main distribution board positioned.',
    author: 'Pak Budi (Electrical Lead)',
    photos: []
  },
  {
    id: 'u3', projectId: 'p1', date: '2024-02-26T11:15:00Z',
    text: 'New premium Italian tiles delivered to site. These will be used for the main living area next month.',
    author: 'Admin',
    photos: ['https://images.unsplash.com/photo-1523413555809-0fb1d4da238d?auto=format&fit=crop&q=80']
  }
];
