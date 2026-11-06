import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  forwardRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface UploadFileItem {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  extension: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
  previewUrl?: string;
  file?: File;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-3">
      <!-- Label -->
      @if (label) {
        <div class="flex items-center justify-between">
          <label class="block text-xs font-bold uppercase tracking-wider text-liver-black">
            {{ label }}
            @if (required) {
              <span class="text-liver-red">*</span>
            }
          </label>
          @if (hint) {
            <span class="text-[11px] text-neutral-400">{{ hint }}</span>
          }
        </div>
      }

      <!-- Dropzone Surface -->
      <div
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
        [class.border-liver-red]="isDragging()"
        [class.bg-liver-redLight/40]="isDragging()"
        [class.border-neutral-300]="!isDragging() && !disabled"
        [class.hover:border-liver-red]="!disabled"
        [class.opacity-60]="disabled"
        [class.cursor-not-allowed]="disabled"
        [class.cursor-pointer]="!disabled"
        class="relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all bg-white group focus:outline-none focus:ring-2 focus:ring-liver-red/20"
        tabindex="0"
        (keydown.enter)="!disabled && fileInput.click()"
        (keydown.space)="!disabled && fileInput.click()"
      >
        <!-- Hidden Native File Input -->
        <input
          #fileInput
          type="file"
          [multiple]="multiple"
          [accept]="accept"
          [disabled]="disabled"
          (change)="onFileSelected($event)"
          class="hidden"
        />

        <div class="flex flex-col items-center justify-center gap-3">
          <!-- Cloud Upload Icon Container -->
          <div
            [class.bg-liver-red]="isDragging()"
            [class.text-white]="isDragging()"
            [class.scale-110]="isDragging()"
            class="w-14 h-14 rounded-2xl bg-neutral-100 text-liver-black group-hover:bg-liver-red group-hover:text-white transition-all flex items-center justify-center text-xl shadow-sm"
          >
            <i class="fa-solid fa-cloud-arrow-up"></i>
          </div>

          <!-- Main Text Brief -->
          <div class="space-y-1">
            <p class="text-xs sm:text-sm font-bold text-liver-black">
              Kéo thả tệp tin vào đây hoặc
              <span class="text-liver-red group-hover:underline">Duyệt từ máy tính</span>
            </p>
            <p class="text-[11px] text-neutral-400">
              Định dạng hỗ trợ: <span class="font-medium text-neutral-600">{{ acceptDescription || accept || 'Mọi định dạng' }}</span>
              • Tối đa <span class="font-bold text-neutral-700">{{ maxFileSizeMb }}MB</span>
              @if (multiple && maxFiles) {
                • Tối đa {{ maxFiles }} tệp
              }
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      @if (errorMessage()) {
        <div class="flex items-center gap-1.5 text-xs text-liver-red font-medium">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errorMessage() }}</span>
        </div>
      }

      <!-- Uploaded Files List -->
      @if (fileList().length > 0) {
        <div class="space-y-2 pt-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            <span>Danh sách tệp tin ({{ fileList().length }})</span>
            @if (!disabled) {
              <button
                type="button"
                (click)="clearAllFiles()"
                class="text-neutral-400 hover:text-liver-red transition-colors normal-case"
              >
                Xóa tất cả
              </button>
            }
          </div>

          <div class="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            @for (item of fileList(); track item.id; let i = $index) {
              <div class="p-3 flex items-center gap-3 hover:bg-neutral-50/80 transition-colors">
                <!-- Thumbnail or File Icon -->
                @if (item.previewUrl) {
                  <img
                    [src]="item.previewUrl"
                    [alt]="item.name"
                    class="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                } @else {
                  <div
                    [class]="getFileIconBackground(item.extension)"
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-sm shrink-0"
                  >
                    <i [class]="getFileIconClass(item.extension)"></i>
                  </div>
                }

                <!-- File Info & Progress Bar -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <p class="text-xs font-bold text-liver-black truncate" [title]="item.name">
                      {{ item.name }}
                    </p>
                    <span class="text-[10px] text-neutral-400 font-medium shrink-0">
                      {{ item.formattedSize }}
                    </span>
                  </div>

                  <!-- Progress Bar -->
                  @if (item.status === 'uploading') {
                    <div class="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-liver-red transition-all duration-200 rounded-full"
                        [style.width.%]="item.progress"
                      ></div>
                    </div>
                  } @else if (item.status === 'error') {
                    <p class="text-[10px] text-liver-red font-medium">
                      {{ item.errorMessage || 'Lỗi tải lên' }}
                    </p>
                  } @else {
                    <div class="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                      <i class="fa-solid fa-circle-check text-[11px]"></i>
                      <span>Đã tải lên hoàn tất</span>
                    </div>
                  }
                </div>

                <!-- Action Button -->
                @if (!disabled) {
                  <button
                    type="button"
                    (click)="removeFile(i, $event)"
                    class="w-7 h-7 rounded-lg text-neutral-400 hover:text-liver-red hover:bg-neutral-100 flex items-center justify-center transition-colors shrink-0"
                    title="Xóa tệp"
                  >
                    <i class="fa-solid fa-trash-can text-xs"></i>
                  </button>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() hint = '';
  @Input() required = false;
  @Input() multiple = true;
  @Input() accept = '*/*';
  @Input() acceptDescription = '';
  @Input() maxFileSizeMb = 10;
  @Input() maxFiles = 10;
  @Input() disabled = false;
  @Input() autoUpload = true;

  @Output() filesChange = new EventEmitter<UploadFileItem[]>();
  @Output() fileRemove = new EventEmitter<UploadFileItem>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly isDragging = signal(false);
  readonly errorMessage = signal('');
  readonly fileList = signal<UploadFileItem[]>([]);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: any): void {
    if (Array.isArray(val)) {
      this.fileList.set(val);
    } else if (val) {
      this.fileList.set([val]);
    } else {
      this.fileList.set([]);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
      input.value = ''; // Reset input to allow re-uploading same file
    }
  }

  private handleFiles(files: File[]): void {
    this.errorMessage.set('');
    this.onTouched();

    if (!this.multiple && files.length > 1) {
      files = [files[0]];
    }

    const currentFiles = this.fileList();
    if (this.multiple && this.maxFiles && currentFiles.length + files.length > this.maxFiles) {
      this.errorMessage.set(`Chỉ được phép tải lên tối đa ${this.maxFiles} tệp tin.`);
      return;
    }

    const newItems: UploadFileItem[] = [];

    for (const file of files) {
      // Validate file size
      const maxBytes = this.maxFileSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        this.errorMessage.set(`Tệp "${file.name}" vượt quá kích thước cho phép (${this.maxFileSizeMb}MB).`);
        continue;
      }

      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const id = 'f-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

      const item: UploadFileItem = {
        id,
        name: file.name,
        size: file.size,
        formattedSize: this.formatBytes(file.size),
        type: file.type,
        extension,
        progress: this.autoUpload ? 0 : 100,
        status: this.autoUpload ? 'uploading' : 'success',
        file
      };

      // Generate preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          item.previewUrl = e.target?.result as string;
          this.fileList.update(list => [...list]);
        };
        reader.readAsDataURL(file);
      }

      newItems.push(item);
    }

    const updatedList = this.multiple ? [...currentFiles, ...newItems] : newItems;
    this.fileList.set(updatedList);
    this.notifyChange();

    if (this.autoUpload) {
      newItems.forEach(item => this.simulateUpload(item.id));
    }
  }

  private simulateUpload(itemId: string): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.updateFileStatus(itemId, 100, 'success');
      } else {
        this.updateFileStatus(itemId, progress, 'uploading');
      }
    }, 80);
  }

  private updateFileStatus(id: string, progress: number, status: 'uploading' | 'success' | 'error'): void {
    this.fileList.update(list =>
      list.map(item => (item.id === id ? { ...item, progress, status } : item))
    );
    this.notifyChange();
  }

  removeFile(index: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const current = this.fileList();
    const removed = current[index];
    const updated = current.filter((_, i) => i !== index);
    this.fileList.set(updated);
    this.notifyChange();
    if (removed) {
      this.fileRemove.emit(removed);
    }
  }

  clearAllFiles(): void {
    this.fileList.set([]);
    this.notifyChange();
  }

  private notifyChange(): void {
    const list = this.fileList();
    this.onChange(list);
    this.filesChange.emit(list);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getFileIconClass(ext: string): string {
    switch (ext) {
      case 'pdf':
        return 'fa-solid fa-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'fa-solid fa-file-word text-blue-500';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'fa-solid fa-file-excel text-emerald-500';
      case 'ppt':
      case 'pptx':
        return 'fa-solid fa-file-powerpoint text-amber-500';
      case 'zip':
      case 'rar':
      case '7z':
        return 'fa-solid fa-file-zipper text-purple-500';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'fa-solid fa-file-image text-cyan-500';
      default:
        return 'fa-solid fa-file text-neutral-500';
    }
  }

  getFileIconBackground(ext: string): string {
    switch (ext) {
      case 'pdf':
        return 'bg-red-50';
      case 'doc':
      case 'docx':
        return 'bg-blue-50';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'bg-emerald-50';
      case 'ppt':
      case 'pptx':
        return 'bg-amber-50';
      case 'zip':
      case 'rar':
      case '7z':
        return 'bg-purple-50';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'bg-cyan-50';
      default:
        return 'bg-neutral-100';
    }
  }
}
