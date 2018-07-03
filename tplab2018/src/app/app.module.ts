import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
//CSS
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//PAGES
import { AppComponent } from './app.component';
import { MenuComponent } from './pages/menu/menu.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { UsuarioAbmComponent } from './pages/usuario-abm/usuario-abm.component';
import { ViajesComponent } from './pages/viajes/viajes.component';

//SERVICIOS
import { AuthService } from './servicio/auth.service';
import { UsuarioService } from './servicio/usuario.service';
import { JwtModule } from './jwt/jwt.module';
import { VerificarJwtService } from './servicio/verificar-jwt.service';

//GOOGLE MAPS
import { AgmCoreModule} from '@agm/core';
import { DirectionsMapDirective } from './google-map.directive';

const appRoutes: Routes = [
  { path: 'inicio',component: InicioComponent},
  { path: 'login',component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'usuarios', component: UsuarioAbmComponent, canActivate: [VerificarJwtService] },
  { path: 'viajes', component: ViajesComponent, canActivate: [VerificarJwtService] },
  { path: '',   redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', component: InicioComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InicioComponent,
    LoginComponent,
    RegistroComponent,
    UsuarioAbmComponent,
    ViajesComponent,
    DirectionsMapDirective
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD8oGFz45Lag_VTJcXCzyjbb5P81aMVwbw',
      libraries: ['places']
      }),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    JwtModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [AuthService,UsuarioService,VerificarJwtService],
  bootstrap: [AppComponent]
})
export class AppModule { }
