import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { isAuth } from './guards/is-auth-guard.guard';
import { ConnectivityGuard } from './guards/connectivity.guard';
import { IsConnectGuard } from './guards/is-connect.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ConnectivityGuard],
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'user-register',
    canActivate: [isAuth, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/user-register/user-register.module').then(
        (m) => m.UserRegisterPageModule
      ),
  },
  {
    path: 'store-register',
    canActivate: [isAuth, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/store-register/store-register.module').then(
        (m) => m.StoreRegisterPageModule
      ),
  },
  {
    path: 'store-address',
    canActivate: [isAuth, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/store-address/store-address.module').then(
        (m) => m.StoreAddressPageModule
      ),
  },
  {
    path: 'user-options',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/user-options/user-options.module').then(
        (m) => m.UserOptionsPageModule
      ),
  },
  {
    path: 'user-profile',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      ),
  },
  {
    path: 'glossary',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/glossary/glossary.module').then(
        (m) => m.GlossaryPageModule
      ),
  },
  {
    path: 'standards',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/standards/standards.module').then(
        (m) => m.StandardsPageModule
      ),
  },
  {
    path: 'feedback',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/feedback/feedback.module').then(
        (m) => m.FeedbackPageModule
      ),
  },
  {
    path: 'stores',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/stores/stores.module').then((m) => m.StoresPageModule),
  },
  {
    path: 'map/:id',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/map/map.module').then((m) => m.MapPageModule),
  },
  {
    path: 'store-profile',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/store-profile/store-profile.module').then(
        (m) => m.StoreProfilePageModule
      ),
  },
  {
    path: 'address-profile',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/address-profile/address-profile.module').then(
        (m) => m.AddressProfilePageModule
      ),
  },
  {
    path: 'view-store/:id',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/view-store/view-store.module').then(
        (m) => m.ViewStorePageModule
      ),
  },
  {
    path: 'location',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/location/location.module').then(
        (m) => m.LocationPageModule
      ),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard, ConnectivityGuard],
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'error',
    canActivate: [IsConnectGuard],
    loadChildren: () =>
      import('./pages/error/error.module').then((m) => m.ErrorPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
