import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent, TableCellDirective } from './table.component';
import { TableColumn } from './table.interface';

interface MockItem {
  id: string;
  name: string;
  score: number;
  status: string;
}

describe('TableComponent (Common Table)', () => {
  let fixture: ComponentFixture<TableComponent<MockItem>>;
  let component: TableComponent<MockItem>;

  const mockColumns: TableColumn<MockItem>[] = [
    { key: 'id', title: 'ID', sticky: 'left', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'score', title: 'Score', align: 'right', sortable: true },
    { key: 'status', title: 'Status', sticky: 'right' }
  ];

  const mockData: MockItem[] = [
    { id: '1', name: 'Alpha Project', score: 95, status: 'Active' },
    { id: '2', name: 'Beta Project', score: 80, status: 'Pending' },
    { id: '3', name: 'Gamma System', score: 60, status: 'Critical' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, TableCellDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<MockItem>);
    component = fixture.componentInstance;
    component.columns = mockColumns;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create generic table component', () => {
    expect(component).toBeTruthy();
  });

  it('should render columns dynamically based on input', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('ID');
    expect(el.textContent).toContain('Name');
    expect(el.textContent).toContain('Score');
    expect(el.textContent).toContain('Status');
  });

  it('should render data rows dynamically', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Alpha Project');
    expect(el.textContent).toContain('Beta Project');
    expect(el.textContent).toContain('Gamma System');
  });

  it('should support sorting columns', () => {
    component.toggleSort('score');
    expect(component.sortState.field).toBe('score');
    expect(component.sortState.direction).toBe('asc');
    expect(component.filteredAndSortedRows[0].score).toBe(60);

    component.toggleSort('score');
    expect(component.sortState.direction).toBe('desc');
    expect(component.filteredAndSortedRows[0].score).toBe(95);
  });

  it('should support search filtering across fields', () => {
    component.searchKeyword = 'Beta';
    expect(component.filteredAndSortedRows.length).toBe(1);
    expect(component.filteredAndSortedRows[0].name).toBe('Beta Project');
  });

  it('should apply sticky-col-left and sticky-col-right classes', () => {
    const stickyLeft = fixture.nativeElement.querySelector('.sticky-col-left');
    const stickyRight = fixture.nativeElement.querySelector('.sticky-col-right');
    expect(stickyLeft).toBeTruthy();
    expect(stickyRight).toBeTruthy();
  });

  it('should render loading overlay when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingEl = fixture.nativeElement.querySelector('.table-loading-overlay');
    expect(loadingEl).toBeTruthy();
    expect(loadingEl.textContent).toContain('Đang tải dữ liệu...');
  });

  it('should prioritize serverSide mode by default and emit onLazyLoad', () => {
    expect(component.serverSide).toBe(true);

    let lazyEvent: any;
    component.onLazyLoad.subscribe(ev => {
      lazyEvent = ev;
    });

    component.totalRecords = 100;
    component.pageSize = 10;
    expect(component.totalPages).toBe(10);

    component.toggleSort('score');
    expect(lazyEvent).toEqual(
      expect.objectContaining({
        page: 1,
        pageSize: 10,
        sortField: 'score',
        sortDirection: 'asc'
      })
    );

    component.goToPage(3);
    expect(lazyEvent).toEqual(
      expect.objectContaining({
        page: 3,
        pageSize: 10
      })
    );

    component.onSearchChange('alpha');
    expect(lazyEvent).toEqual(
      expect.objectContaining({
        page: 1,
        searchKeyword: 'alpha'
      })
    );
  });
});

