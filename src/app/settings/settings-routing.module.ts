import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { GeneralSettingsComponent } from './ui/general-settings/general-settings.component';
import { SetStorageFileComponent } from './ui/set-storage-file/set-storage-file.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        component: GeneralSettingsComponent
      },
      {
        path: 'set-storage-file',
        component: SetStorageFileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
