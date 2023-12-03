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
2. Разгон осуществляется путем выставления параметров в оверлей меню `sys-clk-oc`.
3. Для управления разгоном используйте оверлей `UltraHand` (зайти в `Tesla` меню, нажать внопку `вправо`), пакет `OC-Suite Configurator`.
4. Чем ниже параметры разгона, тем безопасней и тем меньше побочных эффектов. Используйте с умом!
5. Рекомендованные параметры разгона для портативного режима и игре от батареи: CPU `1020 - 1428`, GPU `768 - 921`, MEM Max. Чем ниже параметры CPU и GPU, тем дольше вы сохраните заряд батареи и тем холоднее будет ваша консоль.

## OC-Suite Configurator

### Требования к железу

- Nintendo Switch V1 (Erista)
- Nintendo Switch V2 (Mariko)
- Nintendo Switch Lite (Mariko)
- Nintendo Switch OLED (Mariko)

### Требования к софту

- UltraHand Overlay (входит в комплект бандла)

### Настройки разгона

* CPU
  * Undervolt Mode: управление энергоэффективностью процессора, снижение потребления по нарастающей компоненте (только для Mariko)
  * Voltage Max: управление максимальным напряжением
  * Boost Clock: частота процессора которая влияет на ускорение загрузок в играх
* GPU
  * Undervolt Mode: управление энергоэффективностью графического процессора (только для Mariko)
  * UV3 Table: пользовательская кастомизированная таблица напряжений (только для Mariko)
  * Voltage Offset: отрицательное смещение напряжений GPU
  * Voltage Min: высокие частоты RAM требуют повышения напряжения на минимальных частотах
* RAM
  * Max Clock: максимальная частота памяти, рекомендуемые параметры в диапазоне `2133` - `2400` для Mariko, `1862 - 2131` для Erista.
  * Vddq: напряжение выходных буферов микросхемы памяти (только для Mariko)
  * Vdd2: напряжение входных буферов микросхемы памяти
  * EMC DVB Table: таблица напряжений EMC, параметр работает автоматически, рекомендуется использовать для повышения стабильности разгона памяти на высоких частотах
  * Timings: тайминги повышают производительность, но вызывают вероятость побочных эффектов

### Настройки Sys-Clk-OC
* Allow Unsafe Freqs: разрешить небезопасные частоты (CPU > 1963, GPU > 921)
* Remove Clocks Capping: отключение ограничителей частот GPU/CPU
* Override Boost Mode: переопределение частот (CPU/GPU) буст мода с помощью заданных пользователем через `sys-clk-oc` значений
* Auto CPU boost: для игр без официальной поддержки буст мода, активируется при загрузке ядра CPU >= 95%

## Философия

Правило по которому нужно руководствоваться используя разгон консоли — отсутствие побочных эффектов. Консоль должна работать без крашей атмосферы, без внезапных вылетов из игр, без отключения по перегреву. Добившись этого результата мы получаем стабильную консоль, высокую производительность в играх и сбалансированное энергопотребление.

## FAQ

- Если после установки возникли проблемы, попробуйте сделать фикс атрибутов: зайдите в `Hekate` → `Tools` → `Arch Bit`
- При установке обновления в `All-in-One Switch Updater` на предложение перезаписать конфиги ответ `ДА`, на предложение устаровить `Hekate` ответ `НЕТ`
- С вопросами, помощью, пожеланиями и предложениями обращаться в [официальную Telegram группу](https://t.me/NintendoBusters) или дискорд сервер [NSwitch 60FPS Cheats & Mods](https://discord.gg/UZZbScp2) (канал #overlocking).

## Состав проекта

- [Atmosphere](https://github.com/Atmosphere-NX/Atmosphere)
- [Hekate](https://github.com/CTCaer/hekate)
- [Sigpatches](https://sigmapatches.coomer.party)
- [Switch OC Suite](https://github.com/hanai3Bi/Switch-OC-Suite)
- [SaltyNX](https://github.com/masagrator/SaltyNX)
- [FPSLocker](https://github.com/masagrator/FPSLocker)
- [ReverseNX-RT](https://github.com/masagrator/ReverseNX-RT)
- [InfoNX](https://github.com/renA21/InfoNX)
- [Ultrahand](https://github.com/ppkantorski/Ultrahand-Overlay)
- [Status Monitor](https://github.com/hanai3Bi/Status-Monitor-Overlay)
- [Sys ftpd light](https://github.com/cathery/sys-ftpd)
- [DBI](https://github.com/rashevskyv/dbi)
- [AIO Switch Updater](https://github.com/HamletDuFromage/aio-switch-updater)
- [Lockpick RCM](https://github.com/s1204IT/Lockpick_RCM)
- [TegraExplorer](https://github.com/suchmememanyskill/TegraExplorer)
- [Picofly Toolbox](https://github.com/Ansem-SoD/Picofly)

## Благодарности

Отдельное спасибо meha, b0rd2dEAth, redraz, b3711, lineon, Руслану, MasaGratoR, CtC, дискорд комьюнити `NSwitch 60FPS Cheats & Mods` и `RetroNX` за реализацию отдельных компонентов этого бандла
