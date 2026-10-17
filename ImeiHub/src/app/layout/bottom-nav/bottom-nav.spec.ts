import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BottomNav } from './bottom-nav';

@Component({ template: '' })
class Blank {}

describe('BottomNav', () => {
  it('uses short labels, shows badges and marks the active route', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: Blank }])],
    });
    const fixture = TestBed.createComponent(BottomNav);
    await TestBed.inject(Router).navigateByUrl('/loans');
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const labels = Array.from(el.querySelectorAll('small')).map((s) => s.textContent?.trim());
    expect(labels).toEqual(['Panel', 'Movim.', 'Órdenes', 'Inventario', 'Prést.']);
    expect(el.querySelectorAll('i').length).toBe(2);
    expect(el.querySelector('a.active small')?.textContent?.trim()).toBe('Prést.');
  });
});
