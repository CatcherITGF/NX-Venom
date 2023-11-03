# Overlocking Bundle

Русский: [Russian](https://github.com/snupt/NS-Overlocking/blob/main/README-ru.md)

## Technical support
Telegram: [Nintendo Busters](https://t.me/NintendoBusters)  
Discord: [NSwitch 60FPS Cheats & Mods](https://discord.gg/UZZbScp2) (канал #overlocking)

## Warning

**ATTENTION! Overclocking the console does not lead to irreversible consequences, however, it poses a risk to data due to the features of Horizon OS. Therefore, it is strongly recommended to use overclocking exclusively in emuMMC and make backups. USE AT YOUR OWN RISK!**

## Installation

1. Make data backup copy and leave only `emuMMC` and `Nintendo` folders on the SD card.
2. Unpack [OC Bundle](https://github.com/snupt/NS-Overlocking/blob/main/OCBundle.zip) to the root of the SD card. Use a card reader, or `Hekate` → `Tools` → `USB Tools`.
3. Use `All-in-One Switch Updater` homebrew application for updates.
4. Installation of additional software, as well as patches for games, makes through the `Tesla` menu (click `right`) → `Software Installer`.

## How to use

1. Opening the `Tesla` menu (as well as exiting the `Status Monitor`) by a combination `ZR + ZL + Down`.
2. Use `sys-clk` overlay for manage overclocking.
3. Use `OC Toolkit` (go to the `Tesla` menu, press the `right` button) for change the parameters of the loading kip.
4. The lower the acceleration parameters, the safer and the fewer side effects. Use wisely!
5. Recommended overclocking parameters for portable mode and battery life: CPU `918 - 1428`, GPU `768 - 921`, MEM `2131 - 2400`.

## OC Toolkit

* CPU
  * Undervolt Mode: CPU energy efficiency management
  * Voltage Limit: maximum CPU voltage
  * Boost Clock: processor frequency that affects the acceleration of loading screens in games
* GPU
  * Undervolt Mode: GPU energy efficiency management
    * UV0: first type of undervolt (HiOPT)
    * UV1: overvolt with a minimum voltage 635mV, for memory freqs 2500 GHz and above
    * UV2: second type of undervolt
  * UV3 Table: custom voltage table
* RAM
  * Max Clock: memory frequency, recommended parameters range `2131` - `2400`
  * Vddq: supply voltage to the output buffers of a memory chip
  * Vdd2: supply voltage for the input buffers and core logic of a memory chip
  * EMC DVB Table: turns on at the frequency `2400` and higher, recommended for stability at high frequencies
  * Timings: timings increase performance, but may affect stability

## Philosophy

The rule by which you need to be guided using console overclocking is the absence of side effects. The console should work without atmosphere errors game crashes, shutdown due to overheating. Having achieved this result, you get a stable console, high performance in games and balanced power consumption.

## FAQ

- If there are problems after installation, try to fix the attributes: `Hekate` → `Tools` → `Arch Bit`
- When use `All-in-One Switch Updater`, the answer to "Do you want to overwrite existing .ini config" is `YES`, the answer to "Do you want also download hekate" is `NO`
- With questions, help, wishes and suggestions, contact the Telegram group [Nintendo Busters](https://t.me/NintendoBusters) or Discord server [NSwitch 60FPS Cheats & Mods](https://discord.gg/UZZbScp2) (channel #overlocking).

## Content

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

## Credits

Special thanks to b7311, lineon, Ruslan, CtC, discord community `NSwitch 60FPS Cheats & Mods` and `RetroNX` for implementing individual components of this bundle
