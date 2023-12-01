# Nintendo Switch Overclocking Bundle

Русский: [Russian](https://github.com/snupt/NS-Overclocking/blob/main/README-ru.md)

## Technical support
Telegram: [Nintendo Busters](https://t.me/NintendoBusters)  
Discord: [NSwitch 60FPS Cheats & Mods](https://discord.gg/UZZbScp2) (channel #overclocking)

## Warning

**ATTENTION! Overclocking the console does not lead to irreversible consequences, however, it poses a risk to data due to the features of Horizon OS. Therefore, it is strongly recommended to use overclocking exclusively in emuMMC and make backups. USE AT YOUR OWN RISK!**

## Installation

1. Make backup and delete everything except `Nintendo` and `emuMMC` folders on the SD card.
2. Unpack the [OC Bundle](https://github.com/snupt/NS-Overclocking/blob/main/OCBundle.zip) to the root of the SD card. Use a card reader, or `Hekate` → `Tools` → `USB Tools`.
3. Use the `All-in-One Switch Updater` homebrew application for updates.
4. Installation of additional software, as well as patches for games, is done through the `Tesla` menu (click `right`) → `Software Installer`.

## How to use

1. Opening the `Tesla` menu (as well as exiting the `Status Monitor`) by a combination `ZR + ZL + Down`.
2. Use the `sys-clk-oc` overlay to manage overclocking.
3. Use the `OC-Suite Configurator` (go to the `Tesla` menu, press the `right` button) to change the parameters of the loading kip.
4. The lower the acceleration parameters, the safer and the fewer side effects. Use wisely!
5. Recommended overclocking parameters for portable mode and battery life: CPU `1020 - 1428`, GPU `768 - 921`, Mem Max.

## OC-Suite Configurator

### Requirements

- Nintendo Switch V1 (Erista)
- Nintendo Switch V2 (Mariko)
- Nintendo Switch Lite (Mariko)
- Nintendo Switch OLED (Mariko)

### Kip Settings

* CPU
  * Undervolt Mode: CPU energy efficiency management (Marico only)
  * Voltage Max: maximum CPU voltage, recommended 1235mV or below
  * Boost Clock: CPU frequency that affects the acceleration of loading screens in games
* GPU
  * Undervolt Mode: GPU energy efficiency management (Marico only)
  * UV3 Table: custom voltage table (Marico only)
  * Voltage Offset: negative voltage offset value for gpu dynamic voltage calculation
  * Voltage Min: high RAM clocks will require gpu minimum voltage to be raised
* RAM
  * Max Clock: memory frequency, recommended parameters range `2133` - `2400` for Mariko and `1862 - 2131` for Erista
  * Vdd2: supply voltage for the input buffers and core logic of a memory chip
  * Vddq: supply voltage to the output buffers of a memory chip (Marico only)
  * EMC DVB Table: SoC voltage automatically gets raised with higher dram clock, shift number raises helps with stability at higher memory clock
  * Timings: timings increase performance, but may affect stability

### Sys-Clk-OC Settings

* Allow Unsafe Freqs: allow unsafe frequencies (CPU > 1963.5 MHz, GPU > 921.6 MHz)
* Remove Clocks Capping: remove CPU/GPU clock cappings
* Override Boost Mode: override boost mode frequency with user set values (CPU/GPU)
* Auto CPU boost: for games without official boost mode, activates when CPU core utilize >= 95%

## Philosophy

The rule by which you need to be guided using console overclocking is the absence of side effects. The console should work without atmosphere errors, game crashes, shutdown due to overheating. Having achieved this result, you get a stable console, high performance in games and balanced power consumption.

## FAQ

- If there are problems after installation, try to fix the attributes: `Hekate` → `Tools` → `Arch Bit`
- When use `All-in-One Switch Updater`, the answer to "Do you want to overwrite existing .ini config" is `YES`, the answer to "Do you want also download hekate" is `NO`
- For questions, help, wishes and suggestions, feel free to contact the Telegram group [Nintendo Busters](https://t.me/NintendoBusters) or Discord server [NSwitch 60FPS Cheats & Mods](https://discord.gg/UZZbScp2) (channel #overlocking).

## Content

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

## Credits

Special thanks to meha, b0rd2dEAth, b3711, lineon, Ruslan, MasaGratoR, CtC, discord community `NSwitch 60FPS Cheats & Mods` and `RetroNX` for implementing individual components of this bundle
