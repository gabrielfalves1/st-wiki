import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { isAuth } from './guards/is-auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'user-register',
    canActivate: [isAuth],
    loadChildren: () =>
      import('./pages/user-register/user-register.module').then(
        (m) => m.UserRegisterPageModule
      ),
  },
  {
    path: 'store-register',
    canActivate: [isAuth],
    loadChildren: () =>
      import('./pages/store-register/store-register.module').then(
        (m) => m.StoreRegisterPageModule
      ),
  },
  {
    path: 'store-address',
    canActivate: [isAuth],
    loadChildren: () =>
      import('./pages/store-address/store-address.module').then(
        (m) => m.StoreAddressPageModule
      ),
  },
  {
    path: 'user-options',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/user-options/user-options.module').then(
        (m) => m.UserOptionsPageModule
      ),
  },
  {
    path: 'user-profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      ),
  },
  {
    path: 'glossary',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/glossary/glossary.module').then(
        (m) => m.GlossaryPageModule
      ),
  },
  {
    path: 'standards',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/standards/standards.module').then(
        (m) => m.StandardsPageModule
      ),
  },
  {
    path: 'feedback',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/feedback/feedback.module').then(
        (m) => m.FeedbackPageModule
      ),
  },
  {
    path: 'stores',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/stores/stores.module').then((m) => m.StoresPageModule),
  },
  {
    path: 'map/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/map/map.module').then((m) => m.MapPageModule),
  },
  {
    path: 'store-profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/store-profile/store-profile.module').then(
        (m) => m.StoreProfilePageModule
      ),
  },
  {
    path: 'address-profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/address-profile/address-profile.module').then(
        (m) => m.AddressProfilePageModule
      ),
  },
  {
    path: 'view-store/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/view-store/view-store.module').then(
        (m) => m.ViewStorePageModule
      ),
  },
  {
    path: 'location',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/location/location.module').then(
        (m) => m.LocationPageModule
      ),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
