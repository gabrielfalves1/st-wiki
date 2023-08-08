import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth-guard.guard';
import { isAuth } from '../guards/is-auth-guard.guard';
import { ConnectivityGuard } from '../guards/connectivity.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        canActivate: [isAuth],
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'tab2',
        canActivate: [isAuth, ConnectivityGuard],
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'tab3',
        canActivate: [isAuth, ConnectivityGuard],
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        path: 'userRegister',
        canActivate: [isAuth, ConnectivityGuard],
        loadChildren: () =>
          import('../pages/user-register/user-register.module').then(
            (m) => m.UserRegisterPageModule
          ),
      },
      {
        path: 'storeRegister',
        canActivate: [isAuth, ConnectivityGuard],
        loadChildren: () =>
          import('../pages/store-register/store-register.module').then(
            (m) => m.StoreRegisterPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
