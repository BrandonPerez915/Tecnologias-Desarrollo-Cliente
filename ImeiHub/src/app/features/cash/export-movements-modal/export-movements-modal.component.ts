import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { CashService } from '../../../core/services/cash.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-export-movements-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SheetComponent],
  templateUrl: './export-movements-modal.component.html',
  styleUrls: ['./export-movements-modal.component.css']
})
export class ExportMovementsModalComponent {
  private cashService = inject(CashService);
  private notifyService = inject(NotificationService);

  format = 'csv';
  location = 'choose';
  showExport = signal(false);

  async exportData() {
    const entries = this.cashService.entries();
    const headers = ['Hora', 'Movimiento', 'Detalles', 'Importe', 'Tipo'];
    const rows = entries.map((entry) => [
      entry.time,
      entry.title,
      entry.note,
      entry.amount,
      entry.kind === 'in' ? 'Entrada' : 'Salida',
    ]);
    const extension = this.format === 'xlsx' ? 'xls' : this.format;
    let content: string;
    let mime: string;
    if (this.format === 'json') {
      content = JSON.stringify(entries, null, 2);
      mime = 'application/json';
    } else {
      const separator = this.format === 'txt' ? '\t' : ',';
      content = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) =>
              this.format === 'txt' ? cell : `"${String(cell).replaceAll('"', '""')}"`
            )
            .join(separator)
        )
        .join('\n');
      mime =
        this.format === 'xlsx'
          ? 'application/vnd.ms-excel'
          : this.format === 'csv'
            ? 'text/csv'
            : 'text/plain';
    }

    const blob = new Blob(
      [this.format === 'json' ? content : `\uFEFF${content}`],
      { type: `${mime};charset=utf-8` }
    );
    const filename = `movimientos-caja.${extension}`;
    const filePicker = (
      window as Window & {
        showSaveFilePicker?: (options: {
          suggestedName: string;
          types: { description: string; accept: Record<string, string[]> }[];
        }) => Promise<{
          createWritable: () => Promise<{
            write: (data: Blob) => Promise<void>;
            close: () => Promise<void>;
          }>;
        }>;
      }
    ).showSaveFilePicker;

    if (this.location === 'choose' && filePicker) {
      try {
        const handle = await filePicker({
          suggestedName: filename,
          types: [
            {
              description: 'Archivo de movimientos',
              accept: { [mime]: [`.${extension}`] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        this.notifyService.show(`Movimientos exportados como ${filename}`, 'success');
        this.showExport.set(false);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    this.notifyService.show(`Movimientos exportados como ${filename}`, 'success');
    this.showExport.set(false);
  }
}
