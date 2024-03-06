import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should.show a message', () => {
    service.show('Hello World', { click: () => {}, label: 'OK' });
    expect(service.messages()[0].message).toBe('Hello World');
  });

  it('should remove a message', () => {
    service.show('Hello World', { click: () => {}, label: 'OK' });
    const message = service.messages()[0];
    service.remove(message.id);
    expect(service.messages()).toEqual([]);
  });

  it('should reset the timeout', () => {
    service.show('Hello World', { click: () => {}, label: 'OK' });
    const message = service.messages()[0];
    const timeout = message.timeout;
    service.resetTimeout(message.id);
    expect(message.timeout).not.toBe(timeout);
  });

  it('should.show a message to a position that is not yet taken', () => {
    service.show('Hello World', { click: () => {}, label: 'OK' });
    service.show('Hello World', { click: () => {}, label: 'OK' });
    expect(service.messages()[0].position).toBe(0);
    expect(service.messages()[1].position).toBe(1);
  });

});
