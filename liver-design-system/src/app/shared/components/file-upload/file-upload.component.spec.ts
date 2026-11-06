import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<FileUploadComponent>;
  let component: FileUploadComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.label = 'Tài liệu đính kèm';
    fixture.detectChanges();
  });

  it('should create file upload component', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and dropzone elements', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Tài liệu đính kèm');
    expect(el.textContent).toContain('Kéo thả tệp tin');
  });

  it('should handle remove file correctly', () => {
    component.fileList.set([
      {
        id: '1',
        name: 'test.pdf',
        size: 1024,
        formattedSize: '1 KB',
        type: 'application/pdf',
        extension: 'pdf',
        progress: 100,
        status: 'success'
      }
    ]);
    fixture.detectChanges();

    expect(component.fileList().length).toBe(1);
    component.removeFile(0);
    expect(component.fileList().length).toBe(0);
  });

  it('should clear all files', () => {
    component.fileList.set([
      {
        id: '1',
        name: 'a.png',
        size: 2048,
        formattedSize: '2 KB',
        type: 'image/png',
        extension: 'png',
        progress: 100,
        status: 'success'
      },
      {
        id: '2',
        name: 'b.pdf',
        size: 4096,
        formattedSize: '4 KB',
        type: 'application/pdf',
        extension: 'pdf',
        progress: 100,
        status: 'success'
      }
    ]);
    fixture.detectChanges();

    expect(component.fileList().length).toBe(2);
    component.clearAllFiles();
    expect(component.fileList().length).toBe(0);
  });
});
