# Nintendo Switch Overclocking Bundle

Английский: [English](https://github.com/snupt/NS-Overclocking/blob/main/README.md)

## Техническая поддержка
Телеграм: [Nintendo Busters](https://t.me/NintendoBusters)  
Дискорд: [NSwitch 60FPS Cheats & Mods](https://discord.gg/UZZbScp2) (канал #overlocking)

## Предупреждение

**ВНИМАНИЕ! Разгон консоли не приводит к необратимым последствиям, однако, он представляет риск для данных из-за особенностей Horizon OS. Поэтому настоятельно рекомендуется использовать оверлокинг исключительно в emuMMC и своевременно делать резервные копии**

## Установка

1. Сделайте резервную копию данных и оставьте на SD карте только папки `emuMMC` и `Nintendo`.
2. Распакуйте архив с [OC Bundle](https://github.com/snupt/NS-Overclocking/blob/main/OCBundle.zip) в корень SD карты. Используйте карт-ридер, либо `Hekate` → `Tools` → `USB Tools`.
3. Обновление бандла осуществляется через хоумбрю приложение `All-in-One Switch Updater`.
4. Установка дополнительного ПО, а так же патчей для игр осуществляется через `Tesla` меню (нажмите `вправо`), `Software Installer`.

## Использование

1. Вход в `Tesla` меню (а так же выход из `Status Monitor`) осуществляется комбинацией `ZR + ZL + Вниз`.
2. Разгон осуществляется путем выставления параметров в оверлей меню `sys-clk`.
3. Для управления разгоном используйте оверлей `UltraHand` (зайти в `Tesla` меню, нажать внопку `вправо`), пакет `OC Toolkit`.
4. Чем ниже параметры разгона, тем безопасней и тем меньше побочных эффектов. Используйте с умом!
5. Рекомендованные параметры разгона для портативного режима и игре от батареи: CPU `918 - 1428`, GPU `768 - 921`, MEM `2131 - 2400`. Чем ниже параметры CPU и GPU, тем дольше вы сохраните заряд батареи и тем холоднее будет ваша консоль.

## OC Toolkit

* CPU
  * Undervolt Mode: управление энергоэффективностью процессора, снижение потребления по нарастающей компоненте
  * Voltage Limit: управление максимальным напряжением
  * Boost Clock: частота процессора которая влияет на ускорение загрузок в играх
* GPU
  * Undervolt Mode: управление энергоэффективностью графического процессора
    * UV0: андрервольт первого типа (HiOPT)
    * UV1: овервольт с минимальным напряжением 635mV, для режима памяти 2500GHz и выше
    * UV2: андервольт второго типа
  * UV3 Table: пользовательская кастомизированная таблица напряжений
* RAM
  * Max Clock: частота памяти, рекомендуемые параметры в диапазоне `2131` - `2400`
  * Vddq: напряжение выходных буферов микросхемы памяти
  * Vdd2: напряжение входных буферов микросхемы памяти
  * EMC DVB Table: таблица напряжений EMC, параметр работает на частоте `2400` и выше, рекомендуется использовать для повышения стабильности разгона памяти на высоких частотах
  * Timings: тайминги повышают производительность, но вызывают вероятость побочных эффектов

## Философия

Правило по которому нужно руководствоваться используя разгон консоли — отсутствие побочных эффектов. Консоль должна работать без крашей атмосферы, без внезапных вылетов из игр, без отключения по перегреву. Добившись этого результата мы получаем стабильную консоль, высокую производительность в играх и сбалансированное энергопотребление.

## FAQ

- Если после установки возникли проблемы, попробуйте сделать фикс атрибутов: зайдите в `Hekate` → `Tools` → `Arch Bit`
- При установке обновления в `All-in-One Switch Updater` на предложение перезаписать конфиги ответ `ДА`, на предложение устаровить `Hekate` ответ `НЕТ`
- С вопросами, помощью, пожеланиями и предложениями обращаться в [официальную Telegram группу](https://t.me/NintendoBusters) или дискорд сервер [NSwitch 60FPS Cheats & Mods](https://discord.gg/UZZbScp2) (канал #overlocking).

## Состав проекта
- [Atmosphere](https://github.com/Atmosphere-NX/Atmosphere/tree/1.6.1-prerelease)
- [Hekate](https://github.com/CTCaer/hekate/releases)
- [Sigpatches](https://sigmapatches.coomer.party)
- [Switch OC Suite](https://github.com/hanai3Bi/Switch-OC-Suite)
- [SaltyNX](https://github.com/masagrator/SaltyNX)
- [FTSLocker](https://github.com/masagrator/FPSLocker)
- [ReverseNX-RT](https://github.com/masagrator/ReverseNX-RT)
- [InfoNX](https://github.com/renA21/InfoNX)
- [Ultrahand](https://github.com/ppkantorski/Ultrahand-Overlay)
- [Status Monitor](https://github.com/ppkantorski/Status-Monitor-Overlay)
- [Sys ftpd light](https://github.com/cathery/sys-ftpd)
- [DBI](https://github.com/rashevskyv/dbi/releases)
- [AIO Switch Updater](https://github.com/HamletDuFromage/aio-switch-updater)
- [Lockpick RCM](https://github.com/s1204IT/Lockpick_RCM)
- [TegraExplorer](https://github.com/suchmememanyskill/TegraExplorer)
- [Picofly Toolbox](https://github.com/Ansem-SoD/Picofly)

## Благодарности

Отдельное спасибо meha, b3711, lineon, Руслану, CtC, дискорд комьюнити `NSwitch 60FPS Cheats & Mods` и `RetroNX` за реализацию отдельных компонентов этого бандла
