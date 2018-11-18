# DB mobile

Utilise Apache Cordova.

# Setup

`cordova prepare` après avoir cloné le dépôt permet de télécharger les plugins / platforms présent(e)s dans le `config.xml`.

# Android Build Tips

`cordova build android`pour build l'APK. Le target SDK doit être présent sur la machine (Installable avec le SDK Manager sur Android Studio).

`cordova emulate android` permet de lancer l'app dans l'émulateur si un AVD est présent sur la machine.

# iOS Build Tips

`cordova build ios --buildFlag="-UseModernBuildSystem=0"` permet de build l'app iOS.

 `cordova emulate ios --target=iPhone-8 --buildFlag="-UseModernBuildSystem=0"`