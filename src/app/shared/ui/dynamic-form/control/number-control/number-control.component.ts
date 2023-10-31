import { Component, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberParser } from '../../utils/number-formatting';

@Component({
    selector: 'app-number-control',
    template: `
      <div class="flex">
        <input class="app-input with-suffix"
          style="border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 0;"
          #input
          (keydown)="onKeyDown($event)"
          (input)="onInput()"
          (blur)="onInputBlurred()"
          [disabled]="disabled">
        <div class="app-input-suffix">
          kr
        </div>
      </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumberControlComponent),
            multi: true
        }
    ],
    standalone: true
})
export class NumberControlComponent implements ControlValueAccessor {

  @ViewChild('input', { read: ElementRef, static: true }) input!: ElementRef<HTMLInputElement>;

  public value!: number;
  public disabled = false;
  public onChange!: (value: number) => void;
  public onTouched!: () => void;
  public nbr = new NumberParser('sv-SE');

  public writeValue(value: number): void {
    this.value = Math.abs(value);
    const el = this.input.nativeElement;
    const cursorPos = el.selectionStart;
    const formatted = this.nbr.format(this.value);
    if (el.value !== formatted) {
      const diff = formatted.length - el.value.length;
      el.value = this.nbr.format(this.value);
      if (cursorPos) {
        el.setSelectionRange(cursorPos + diff, cursorPos + diff);
      }
    }
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onKeyDown(evt: Event) {
    const e = evt as KeyboardEvent;
    const isNumber = /delete|end|home|arrow|backspace|tab|enter|escape|[0-9]|,|\./.test(e.key.toLowerCase());
    const specialIsDown = [e.altKey, e.ctrlKey, e.metaKey].some(Boolean);
    if (!isNumber && !specialIsDown) {
      evt.preventDefault();
      return false;
    }

    if (e.key.toLowerCase() === 'backspace') {
      const el = this.input.nativeElement;
      const cursorPos = el.selectionStart;
      if (cursorPos) {
        const previousChar = el.value[cursorPos - 1];
        if (/\s/.test(previousChar)) {
          el.setSelectionRange(cursorPos - 1, cursorPos - 1);
        }
      }
    }

    if (e.key.toLowerCase() === 'delete') {
      const el = this.input.nativeElement;
      const cursorPos = el.selectionStart;
      if (cursorPos && cursorPos < el.value.length) {
        const nextChar = el.value[cursorPos];
        if (/\s/.test(nextChar)) {
          el.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }
      }
    }

    return true;
  }

  public onInput() {
    const value = this.input.nativeElement.value;
    const parsed = this.nbr.parse(value);
    if (isNaN(parsed)) {
      return;
    }
    this.writeValue(parsed);
    this.onChange(parsed);
  }

  public onInputBlurred(): void {
    this.onTouched();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onValueChange(): void {
    throw new Error('Not implemented exception');
  }


}
