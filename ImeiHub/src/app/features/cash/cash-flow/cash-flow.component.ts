import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { DatePickerSheetComponent } from '../date-picker-sheet/date-picker-sheet.component';
import { ExportMovementsModalComponent } from '../export-movements-modal/export-movements-modal.component';
import { Overlay } from '../../../types/navigation';
import { CashService } from '../../../core/services/cash.service';
import { OverlayService } from '../../../core/services/overlay.service';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent,
    PageHeadingComponent,
    DatePickerSheetComponent,
    ExportMovementsModalComponent,
  ],
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent {
  cashService = inject(CashService);
  private overlayService = inject(OverlayService);

  open = output<Overlay>();

  filter = signal('All');
  selectedDay = signal(18);
  showCalendar = signal(false);

  filterOptions = ['All', 'Money In', 'Money Out'];

  visibleEntries = computed(() => {
    const f = this.filter();
    const day = this.selectedDay();

    if (day !== 18) {
      if (day === 17) {
        const hist = [
          { time: '19:40', title: 'Cierre de turno anterior', note: 'Efectivo retirado · Ada Okafor', amount: '−8,500', kind: 'out' as const },
          { time: '17:15', title: 'Venta Samsung Galaxy S23', note: 'Tarjeta · Folio #9821', amount: '+18,499', kind: 'in' as const },
          { time: '14:30', title: 'Insumos de oficina', note: 'Gastos generales · Factura A-102', amount: '−450', kind: 'out' as const },
          { time: '11:00', title: 'Venta Funda de uso rudo', note: 'Efectivo · Mostrador', amount: '+380', kind: 'in' as const },
        ];
        return hist.filter((e) => {
          if (f === 'All') return true;
          return f === 'Money In' ? e.kind === 'in' : e.kind === 'out';
        });
      }
      return [];
    }

    return this.cashService.entries().filter((entry) => {
      if (f === 'All') return true;
      return f === 'Money In' ? entry.kind === 'in' : entry.kind === 'out';
    });
  });

  openExpenseSheet() {
    this.open.emit('expense');
    this.overlayService.open('expense');
  }

  selectDay(day: number) {
    this.selectedDay.set(day);
    this.showCalendar.set(false);
  }
}
