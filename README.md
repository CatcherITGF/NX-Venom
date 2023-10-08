# Overlocking Bundle

Поддержка: [https://t.me/+mLQ-5DdMdus5MDIy](https://t.me/+mLQ-5DdMdus5MDIy)

**ВНИМАНИЕ! Разгон консоли не приводит к необратимым последствиям. Однако, он представляет риск для данных в виду особенностей Horizon OS. Поэтому настоятельно рекомендуется использовать оверлокинг исключительно в emuMMC и своевременно делать резервные копии**

## Установка

1. Сделайте резервную копию данных и оставьте на SD карте только папки `emuMMC` и `Nintendo`.
2. Распакуйте архив с [OC Bundle](https://github.com/snupt/Switch-OC-Suite-Bundle/raw/main/OCBundle.zip) в корень SD карты. Делать это нужно на компьютере через карт ридер, либо через `Hekate` по USB.
3. Обновление бандла, а так же установка отдельных его компоненов происходят через Homebrew приложение `All-in-One Switch Updater`.


## Использование

1. Вход в `Tesla` меню осуществляется комбинацией `ZR + ZL + Вниз`, выход из `Status Monitor` по одновременную нажатию стиков `R + L`
2. Разгон осуществляется путем выставления параметров в оверлей меню `Switch-OC-Suite`.
3. Для управления разгоном используйте оверлей `UltraHand` (зайти в `Tesla` меню, нажать внопку `вправо`), пакет `OC Toolkit` в соответствии с [документацией](https://github.com/hanai3Bi/Switch-OC-Suite/blob/master/Source/sys-clk-OC/README.md).
4. Чем ниже параметры, тем безопасней разгон и тем меньше побочных эффектов. Выбирайте с умом!
5. Рекомендованные параметры разгона для портативного режима и игре от батареи: CPU `918 - 1428`, GPU `768 - 921`, Memory максимум. Чем ниже параметры CPU и GPU, тем дольше вы сохраните заряд батареи и тем холоднее будет ваша консоль.

## Философия

Правило по которому нужно руководствоваться используя разгон консоли — отсутствие побочных эффектов. Консоль должна работать без крашей атмосферы, без внезапных вылетов из игр, без отключения по перегреву. Добившись этого результата мы получием стабильную консоль, высокую производительность в играх и небольшое энергопотребление.

## FAQ

- Если после установки возникли проблемы, то возможно потребоваться сделать фикс атрибутов: зайдите в Hekate > USB Tool > Arch Bit
- При установке пакетов в `All-in-One Switch Updater` на предложение перезаписать конфиги ответ "ДА", на предложение устаровить Hekate ответ "НЕТ"

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
