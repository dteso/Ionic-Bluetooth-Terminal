# BLUETOOTH SERIAL TERMINAL

## Usar este proyecto

Recuerda tener Android Studio instalado para generar tus apk.

> ### 1. Clónate este proyecto en un directorio local, accede a una consola, navega en ella hasta la ruta donde has clonado el proyecto y ejecuta el comando:
    npm install

> ### 2. A continuación ejecuta:

    ionic cap add android
    ionic cap build android
    ionic cap sync

> ### 3. En este punto recuerda que el equipo desde donde lanzas el servidor y el dispositivo en el que estás volcando el programa deben estar conectados a la misma red y a través de cable USB. Una vez verificado:

    ionic cap run android -l --external 

o instala la aplicación en tu dispositivo mediante Android Studio.

    ionic cap open android

***NOTAS:
  En el momento de desarrollar la aplicación, se está realizando sobre:
    * una versión Gradle 7.0 
    * Android Studio se encuentra en su versión 4.2 

  Actualización descargada el día 23/03/2021.



## Pasos seguidos durante la generación de este proyecto

  1. Instalación global de cli

    npm install -g @ionic/cli native-run cordova-res

  2. Generación de aplicación Ionic con Capacitor como herramienta inicial para el framework Angular

    ionic start bluetoothterminal blank --type=angular --capacitor


> IONIC INFO

  En el momento de estasconfiguraciones iniciales el proyecto arranca a fecha 24/06/2021 con las siguientes versiones:

  Ionic Info - 24/06/2021 
  Ionic:

     Ionic CLI                     : 6.16.3 (C:\Users\d_tes\AppData\Roaming\npm\node_modules\@ionic\cli)
     Ionic Framework               : @ionic/angular 5.6.10
     @angular-devkit/build-angular : 12.0.5
     @angular-devkit/schematics    : 12.0.5
     @angular/cli                  : 12.0.5
     @ionic/angular-toolkit        : 4.0.0

  Capacitor:

     Capacitor CLI      : 3.0.2
     @capacitor/android : 3.0.2
     @capacitor/core    : 3.0.2
     @capacitor/ios     : not installed

  Utility:

     cordova-res : 0.15.3
     native-run  : 1.4.0

  System:

     NodeJS : v14.17.1 (C:\Program Files\nodejs\node.exe)
     npm    : 6.14.13
     OS     : Windows 10

  Crear aplicación: ionic start [blank | tabs | sidemenu] --type=[angular | react | vue] --capacitor?

  Arrancar server local: ionic serve ---> localhost:8100


> Capacitor:

    [ ionic cap sync ] 
    
      ionic capacitor sync [<platform>] [options] => Realiza lo siguiente:
      - Genera una build para Ionic que compila los web assets
      - Copia los web assets a las plataformas nativas de Capacitor correspondientes
      - Actualiza e instala los plugins y dependencias correspondientes
    -----------------------------------------------------------------------------------------------------
    [ ionic cap add android ]
    
       ionic capacitor add <platform> [options] => Agrega un directorio 'platform' con el nombre de la plazaforma donde se incluiran los archivos para la construcción del apk
    -----------------------------------------------------------------------------------------------------
    ionic build / [ ionic cap build android ]
    ionic capacitor build <platform> [options] => Hace las siguientes tareas:

    - Genera una build web
    - Copia los archivos estáticos en el directorio correspondiente a la plataforma indicada (Ej: nombre_proyecto/android).
    - Abre el IDE correspondiente a la plataforma del proyecto ( XCode o Android )
    -----------------------------------------------------------------------------------------------------
    [ ionic cap open ]
   
    ionic capacitor open <platform> [options] => Abre el id cargando la última build generada


> Livereloading:

    - Sobre un dispositivo móvil, debes estar conectado a la misma red local que el equipo donde se ha arrancado la aplicación.
    En caso contrario, se mostrará la pantalla en blanco finalizando con un timeout error.

                                    ionic cap run android -l --external



> Instalación plugin Bluetooth Serial 

    npm i @ionic-native/core
    npm install cordova-plugin-bluetooth-serial
    npm install @ionic-native/bluetooth-serial
    ionic cap sync

   Si ejecutamos directamente en este punto en nuestro dispositivo,
   en consola veremos que tenemos un error de permisos de localización 'Location'.
   Vamos a resolverlo gestionando los permisos a la entrada de la aplicación mediante
   el plugin de capacitor: 

    npm install cordova-plugin-android-permissions
    npm install @ionic-native/android-permissions 



