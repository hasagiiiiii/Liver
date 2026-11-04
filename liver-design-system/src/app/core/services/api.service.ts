import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ProjectItem {
  code: string;
  name: string;
  department: string;
  budget: number;
  date: string;
  status: 'Active' | 'Pending' | 'Critical';
}

export interface ApproverOption {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface TechTagOption {
  id: string;
  name: string;
  icon: string;
}

export interface CustomTag {
  id: string;
  label: string;
  type: 'locked' | 'accent' | 'default';
}

export interface TreeNode {
  id: string;
  label: string;
  expanded?: boolean;
  children?: { id: string; label: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly defaultProjects: ProjectItem[] = [
    { code: 'LVR-001', name: 'Hệ Thống Core Banking LIVER', department: 'Đội Backend Core & API', budget: 485000000, date: '2026-10-24', status: 'Active' },
    { code: 'LVR-002', name: 'Nâng Cấp UI Kit Angular 18', department: 'Đội Frontend Angular', budget: 195000000, date: '2026-10-22', status: 'Active' },
    { code: 'LVR-003', name: 'Tự Động Hóa CI/CD Kubernetes', department: 'Đội Hạ Tầng Cloud & DevOps', budget: 320000000, date: '2026-10-19', status: 'Pending' },
    { code: 'LVR-004', name: 'Bảo Mật Zero-Trust Gateway', department: 'Đội Hạ Tầng Cloud & DevOps', budget: 610000000, date: '2026-10-25', status: 'Critical' },
    { code: 'LVR-005', name: 'CRM Quản Lý Khách Hàng VIP', department: 'Phòng Kinh Doanh Enterprise', budget: 275000000, date: '2026-10-15', status: 'Active' },
    { code: 'LVR-006', name: 'Chiến Dịch Red-Black Branding', department: 'Phòng Growth Marketing', budget: 140000000, date: '2026-10-11', status: 'Pending' },
    { code: 'LVR-007', name: 'Data Warehouse Realtime Sync', department: 'Đội Backend Core & API', budget: 530000000, date: '2026-10-20', status: 'Active' },
    { code: 'LVR-008', name: 'App Mobile LIVER SuperApp', department: 'Đội Frontend Angular', budget: 420000000, date: '2026-10-18', status: 'Critical' }
  ];

  readonly projects = signal<ProjectItem[]>([...this.defaultProjects]);

  readonly approverOptions: ApproverOption[] = [
    { id: 'u1', name: 'Đỗ Văn Trung (Lead Architect)', role: 'Ban Giám Đốc Công Nghệ', avatar: 'DT' },
    { id: 'u2', name: 'Nguyễn Văn A (Senior FE)', role: 'Đội Frontend Angular', avatar: 'NA' },
    { id: 'u3', name: 'Trần Thị B (Product Owner)', role: 'Khối Kinh Doanh Enterprise', avatar: 'TB' },
    { id: 'u4', name: 'Phạm Minh C (DevOps Lead)', role: 'Đội Hạ Tầng Cloud', avatar: 'PC' },
    { id: 'u5', name: 'Lê Hoàng D (Security Engineer)', role: 'Trung Tâm An Toàn Thông Tin', avatar: 'LD' }
  ];

  readonly techMultiOptions: TechTagOption[] = [
    { id: 'ang', name: 'Angular 19+', icon: 'fa-brands fa-angular text-liver-red' },
    { id: 'tw', name: 'Tailwind CSS', icon: 'fa-solid fa-wind text-sky-500' },
    { id: 'rx', name: 'RxJS & Signals', icon: 'fa-solid fa-bolt text-amber-500' },
    { id: 'ts', name: 'TypeScript 5+', icon: 'fa-brands fa-js text-blue-600' },
    { id: 'nest', name: 'NestJS Backend', icon: 'fa-solid fa-server text-liver-red' },
    { id: 'k8s', name: 'Kubernetes Cluster', icon: 'fa-solid fa-dharmachakra text-blue-500' },
    { id: 'docker', name: 'Docker Container', icon: 'fa-brands fa-docker text-sky-600' },
    { id: 'redis', name: 'Redis Cache', icon: 'fa-solid fa-database text-liver-red' }
  ];

  readonly treeDepartments: TreeNode[] = [
    {
      id: 'tech',
      label: 'Khối Công Nghệ (LIVER Tech)',
      expanded: true,
      children: [
        { id: 'fe', label: 'Đội Frontend Angular' },
        { id: 'be', label: 'Đội Backend Core & API' },
        { id: 'devops', label: 'Đội Hạ Tầng Cloud & DevOps' }
      ]
    },
    {
      id: 'biz',
      label: 'Khối Kinh Doanh & Vận Hành',
      expanded: true,
      children: [
        { id: 'sale', label: 'Phòng Kinh Doanh Enterprise' },
        { id: 'mkt', label: 'Phòng Growth Marketing' }
      ]
    }
  ];

  getProjects(): Observable<ProjectItem[]> {
    return of(this.projects());
  }

  addProject(item: ProjectItem): void {
    this.projects.update(list => [item, ...list]);
  }

  deleteProject(code: string): void {
    this.projects.update(list => list.filter(p => p.code !== code));
  }

  resetProjects(): void {
    this.projects.set([...this.defaultProjects]);
  }
}
