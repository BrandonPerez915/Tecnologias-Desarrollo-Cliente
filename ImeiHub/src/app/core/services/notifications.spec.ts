import { TestBed } from '@angular/core/testing';
import { Notifications } from './notifications';

describe('Notifications', () => {
  let service: Notifications;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(Notifications);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a toast and clears it after the duration', () => {
    service.success('Venta registrada');
    expect(service.toast()).toMatchObject({ message: 'Venta registrada', tone: 'success' });
    vi.advanceTimersByTime(2800);
    expect(service.toast()).toBeNull();
  });

  it('replaces the current toast and restarts the timer', () => {
    service.show('Primero', 'neutral', 1000);
    vi.advanceTimersByTime(800);
    service.error('Segundo', 1000);
    vi.advanceTimersByTime(800);
    expect(service.toast()).toMatchObject({ message: 'Segundo', tone: 'danger' });
    vi.advanceTimersByTime(200);
    expect(service.toast()).toBeNull();
  });

  it('clears manually', () => {
    service.warning('Stock bajo');
    service.clear();
    expect(service.toast()).toBeNull();
  });
});
