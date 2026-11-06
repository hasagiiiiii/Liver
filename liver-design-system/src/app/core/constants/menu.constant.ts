export interface MenuItemBadge {
  text: string;
  class?: string;
}

export interface MenuItem {
  id?: string;
  label: string;
  icon?: string;
  route?: string;
  fragment?: string;
  href?: string;
  target?: string;
  badge?: MenuItemBadge | string;
  exact?: boolean;
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'UI Controls & Form',
    icon: 'fa-solid fa-layer-group',
    route: '/dashboard',
    exact: false
  },
  {
    id: 'table',
    label: 'Sticky & Sort Table',
    icon: 'fa-solid fa-table-columns',
    route: '/dashboard',
    fragment: 'tableSection',
    badge: {
      text: 'Hot'
    }
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'fa-solid fa-folder-tree',
    children: [
      {
        id: 'select-multi',
        label: '• ng-Select & Multi',
        route: '/dashboard',
        fragment: 'selectSection'
      },
      {
        id: 'tree-select',
        label: '• Tree-Select',
        route: '/dashboard',
        fragment: 'treeSelectSection'
      },
      {
        id: 'date-range',
        label: '• Date & Date-Range',
        route: '/dashboard',
        fragment: 'dateSection'
      }
    ]
  },
  {
    id: 'users',
    label: 'Quản Lý Người Dùng',
    icon: 'fa-solid fa-users-gear',
    route: '/users',
    badge: {
      text: 'New'
    }
  },
  {
    id: 'analytics',
    label: 'Analytics Report',
    icon: 'fa-solid fa-chart-pie',
    route: '/analytics'
  },
  {
    id: 'profile',
    label: 'Hồ Sơ & Bảo Mật (2FA)',
    icon: 'fa-solid fa-user-shield',
    route: '/profile',
    badge: {
      text: '2FA'
    }
  }
];

export const MENU_CONSTANT = MENU_ITEMS;
export const MENU_CONSTANTS = MENU_ITEMS;
export const SIDEBAR_MENU = MENU_ITEMS;
