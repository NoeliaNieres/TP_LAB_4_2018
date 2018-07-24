import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
//CSS
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BsModalModule } from 'ng2-bs3-modal';

//PAGES
import { AppComponent } from './app.component';
import { MenuComponent } from './pages/menu/menu.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { UsuarioAbmComponent } from './pages/usuario-abm/usuario-abm.component';
import { ViajesComponent } from './pages/viajes/viajes.component';
import { ModificarViajesComponent } from './pages/modificar-viajes/modificar-viajes.component';
import { EncuestaComponent } from './pages/encuesta/encuesta.component';
import { VehiculosComponent } from './pages/vehiculos/vehiculos.component';
import { ViajesPagosComponent } from './pages/viajes-pagos/viajes-pagos.component';

//SERVICIOS
import { AuthService } from './servicio/auth.service';
import { UsuarioService } from './servicio/usuario.service';
import { JwtModule } from './jwt/jwt.module';
import { VerificarJwtService } from './servicio/verificar-jwt.service';

//GOOGLE MAPS
import { AgmCoreModule} from '@agm/core';
import { DirectionsMapDirective } from './google-map.directive';
import { AgmDirectionModule} from 'agm-direction';
import { PesosPipe } from './pipes/pesos.pipe';
///CAPTCHA
import { RecaptchaModule } from 'ng-recaptcha';

///FOTOS
//import { FileDropModule } from 'ngx-file-drop';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule, GrowlModule } from 'primeng/primeng';
import { MessageModule } from 'primeng/message';
import { DataTableModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/galleria';
//DESCARGA DE ARCHIVOS 
import { Angular2CsvModule } from 'angular2-csv';

const appRoutes: Routes = [
  { path: 'inicio',component: InicioComponent},
  { path: 'login',component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'usuarios', component: UsuarioAbmComponent, canActivate: [VerificarJwtService] },
  { path: 'viajes', component: ViajesComponent, canActivate: [VerificarJwtService] },
  { path: 'md-viajes', component: ModificarViajesComponent, canActivate: [VerificarJwtService] },
  { path: 'encuesta', component: EncuestaComponent, canActivate: [VerificarJwtService] },
  { path: 'vehiculos', component: VehiculosComponent, canActivate: [VerificarJwtService] },
  { path: 'pagos', component: ViajesPagosComponent, canActivate: [VerificarJwtService] },
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
    DirectionsMapDirective,
    ModificarViajesComponent,
    EncuestaComponent,
    VehiculosComponent,
    ViajesPagosComponent,
    PesosPipe
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
    AgmDirectionModule,
    BsModalModule,
    FileUploadModule,
    CalendarModule,
    DialogModule,
    ConfirmDialogModule,
    MessagesModule, 
    GrowlModule,
    DataTableModule,
    MessageModule,
    Angular2CsvModule,
    GalleriaModule,
    RecaptchaModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService,UsuarioService,VerificarJwtService],
  bootstrap: [AppComponent]
})
export class AppModule { }
