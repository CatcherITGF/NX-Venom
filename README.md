# Overlocking for Kefir

[Группа в телеграме](https://t.me/kefir_switch/238091)

**ВНИМАНИЕ! Разгон консоли не приводит к необратимым последствиям. Однако, он представляет риск для данных в виду особенностей Horizon OS. Поэтому настоятельно рекомендуется использовать оверлокинг исключительно в emuMMC и своевременно делать резервные копии**

## Установка на Kefir

1. Сделать резервные сохранения всех сохранений игр для избежания возможной потери данных. Используйте `DBI`, входящий в состав `Kefir`.
2. Распакуйте архив с [All-in-One Switch Updater](https://github.com/snupt/Switch-OC-Suite-Bundle/raw/main/AIO.zip) в корень SD карты с заменой/слиянием файлов.
3. Зайдите в Homebrew меню, войдите в `All-in-One Switch Updater`, выберите `OC Suite`, перезагрузитесь.


## Установка с нуля

1. Установить [Kefir](https://codeberg.org/rashevskyv/kefir/releases) и загрузиться в систему после установки для инициализации конфигов.
2. Сделать резервные сохранения всех сохранений игр для избежания возможной потери данных. Используйте `DBI`, входящий в состав `Kefir`.
3. Распакуйте архив с [OS Suite](https://github.com/snupt/Switch-OC-Suite-Bundle/raw/main/OCS.zip) в корень SD карты с заменой/сдиянием файлов. Делать это нужно на компьютере через карт ридер, либо через `Hekate` по USB.
4. Обновление продукта и установка модов происходят через Homebrew приложение `All-in-One Switch Updater`.


## Использование

1. Вход в `Tesla` меню (так же как и выход из `Status Monitor`) осуществляется комбинацией `ZR + ZL + Вниз`.
2. Разгон осуществляется путем выставления параметров в оверлей меню `Switch-OC-Suite`.
3. Для поднятия уровня разгона используйте оверлей `UltraHand` (зайти в `Tesla` меню, нажать внопку `вправо`), пакет `Overlock Booster`.
4. Чем ниже уровень, тем безопасней разгон и тем меньше побочных эффектов. На втором уровне включается только андервольт CPU/GPU. Далее с каждым уровнем повышается частота памяти. Выбирайте с умом!
5. Для ручного выставления параметров разгона используйте [Конфигуратор](https://hanai3bi.github.io/Switch-OC-Suite/), загрузив в него файл, находящийся по пути `/atmosphere/kips/loader.kip`.
6. Рекомендованные параметры разгона для портативного режима и игре от батареи: CPU `918 - 1428`, GPU `768 - 921`, Memory максимум. Чем ниже параметры CPU и GPU, тем дольше вы сохраните заряд батареи.

## Философия

Правило по которому нужно руководствоваться используя разгон консоли — отсутствие побочных эффектов. Консоль должна работать без крашей Атмосферы, без внезапных вылетов из игр, без отключения по перегреву. Добившись этого результата вы получите стабильную консоль, высокую производительность в играх и небольшое энергопотребление.

## Состав проекта

- [Switch OC Suite](https://github.com/hanai3Bi/Switch-OC-Suite)
- [SaltyNX](https://github.com/masagrator/SaltyNX)
- [ReverseNX-RT](https://github.com/masagrator/ReverseNX-RT)
- [InfoNX](https://github.com/renA21/InfoNX)
- [Ultrahand](https://github.com/ppkantorski/Ultrahand-Overlay)
- [Status Monitor](https://github.com/ppkantorski/Status-Monitor-Overlay)
- [Sys ftpd light](https://github.com/cathery/sys-ftpd)
- [JKSV](https://github.com/J-D-K/JKSV)
- [AIO Switch Updater](https://github.com/HamletDuFromage/aio-switch-updater)
