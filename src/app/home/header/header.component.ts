import { Component } from '@angular/core'; @Component({
  selector: 'app-header',
  template: `
  <div class="flex place-content-between items-center mb-4">
    <div class="flex items-center">
      <div class="rounded-full w-12 h-12 bg-amber-500 mr-4"></div>
      <div class="flex flex-col content-between">
        <div class="text-sm text-slate-500">Welcome</div>
        <div class="font-bold">Alfred Gårdeskog</div>
      </div>
    </div>
    <button class="rounded-md bg-white p-1 hover:bg-slate-100 active:bg-white cursor-pointer">
      <cog-6-tooth-outline-icon [size]="18"></cog-6-tooth-outline-icon>
    </button>
  </div>
  `
})
export class HeaderComponent {

}
