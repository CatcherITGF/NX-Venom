var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* Config: Cust */
const CUST_REV_ADV = 14;
var CustPlatform;
(function (CustPlatform) {
    CustPlatform[CustPlatform["Undefined"] = 0] = "Undefined";
    CustPlatform[CustPlatform["Erista"] = 1] = "Erista";
    CustPlatform[CustPlatform["Mariko"] = 2] = "Mariko";
    CustPlatform[CustPlatform["All"] = 3] = "All";
})(CustPlatform || (CustPlatform = {}));
;
class CustEntry {
    constructor(id, name, platform, size, desc, defval, minmax = [0, 1000000], step = 1, zeroable = true) {
        this.id = id;
        this.name = name;
        this.platform = platform;
        this.size = size;
        this.desc = desc;
        this.defval = defval;
        this.step = step;
        this.zeroable = zeroable;
        this.min = minmax[0];
        this.max = minmax[1];
    }
    ;
    validate() {
        let tip = new ErrorToolTip(this.id).clear();
        if (Number.isNaN(this.value) || this.value === undefined) {
            tip.setMsg(`Invalid value: Not a number`).show();
            return false;
        }
        if (this.zeroable && this.value == 0)
            return true;
        if (this.value < this.min || this.value > this.max) {
            tip.setMsg(`Expected range: [${this.min}, ${this.max}], got ${this.value}.`).show();
            return false;
        }
        if (this.value % this.step != 0) {
            tip.setMsg(`${this.value} % ${this.step} ≠ 0`).show();
            return false;
        }
        return true;
    }
    ;
    getInputElement() {
        return document.getElementById(this.id);
    }
    updateValueFromElement() {
        var _a;
        this.value = Number((_a = this.getInputElement()) === null || _a === void 0 ? void 0 : _a.value);
    }
    isAvailableFor(platform) {
        return platform === CustPlatform.Undefined || this.platform === platform || this.platform === CustPlatform.All;
    }
    createElement() {
        let input = this.getInputElement();
        if (!input) {
            let grid = document.createElement("div");
            grid.classList.add("grid", "cust-element");
            // Label and input
            input = document.createElement("input");
            input.min = String(this.zeroable ? 0 : this.min);
            input.max = String(this.max);
            input.id = this.id;
            input.type = "number";
            input.step = String(this.step);
            let label = document.createElement("label");
            label.setAttribute("for", this.id);
            label.innerHTML = this.name;
            label.appendChild(input);
            grid.appendChild(label);
            // Description in blockquote style
            let desc = document.createElement("blockquote");
            desc.innerHTML = "<ul>" + this.desc.map(i => `<li>${i}</li>`).join('') + "</ul>";
            desc.setAttribute("for", this.id);
            grid.appendChild(desc);
            document.getElementById("config-list-basic").appendChild(grid);
            new ErrorToolTip(this.id).addChangeListener();
        }
        input.value = String(this.value);
    }
    setElementValue() {
        this.getInputElement().value = String(this.value);
    }
    setElementDefaultValue() {
        this.getInputElement().value = String(this.defval);
    }
    removeElement() {
        let input = this.getInputElement();
        if (input) {
            input.parentElement.parentElement.remove();
        }
    }
    showElement() {
        let input = this.getInputElement();
        if (input) {
            input.parentElement.parentElement.style.removeProperty("display");
        }
    }
    hideElement() {
        let input = this.getInputElement();
        if (input) {
            input.parentElement.parentElement.style.setProperty("display", "none");
        }
    }
}
class AdvEntry extends CustEntry {
    createElement() {
        let input = this.getInputElement();
        if (!input) {
            let grid = document.createElement("div");
            grid.classList.add("grid", "cust-element");
            // Label and input
            input = document.createElement("input");
            input.min = String(this.zeroable ? 0 : this.min);
            input.max = String(this.max);
            input.id = this.id;
            input.type = "number";
            input.step = String(this.step);
            let label = document.createElement("label");
            label.setAttribute("for", this.id);
            label.innerHTML = this.name;
            label.appendChild(input);
            grid.appendChild(label);
            // Description in blockquote style
            let desc = document.createElement("blockquote");
            desc.innerHTML = "<ul>" + this.desc.map(i => `<li>${i}</li>`).join('') + "</ul>";
            desc.setAttribute("for", this.id);
            grid.appendChild(desc);
            document.getElementById("config-list-advanced").appendChild(grid);
            new ErrorToolTip(this.id).addChangeListener();
        }
        input.value = String(this.value);
    }
}
class GpuEntry extends CustEntry {
    constructor(id, name, platform = CustPlatform.Mariko, size = 4, desc = ["range: 550 ≤ x ≤ 800"], defval = 610, minmax = [550, 800], step = 5, zeroable = false) {
        super(id, name, platform, size, desc, defval, minmax, step, zeroable);
        this.id = id;
        this.name = name;
        this.platform = platform;
        this.size = size;
        this.desc = desc;
        this.defval = defval;
        this.step = step;
        this.zeroable = zeroable;
    }
    ;
    createElement() {
        let input = this.getInputElement();
        if (!input) {
            let grid = document.createElement("div");
            grid.classList.add("grid", "cust-element");
            // Label and input
            input = document.createElement("input");
            input.min = String(this.zeroable ? 0 : this.min);
            input.max = String(this.max);
            input.id = this.id;
            input.type = "number";
            input.step = String(this.step);
            let label = document.createElement("label");
            label.setAttribute("for", this.id);
            label.innerHTML = this.name;
            label.appendChild(input);
            grid.appendChild(label);
            // Description in blockquote style
            let desc = document.createElement("blockquote");
            desc.innerHTML = "<ul>" + this.desc.map(i => `<li>${i}</li>`).join('') + "</ul>";
            desc.setAttribute("for", this.id);
            grid.appendChild(desc);
            document.getElementById("config-list-gpu").appendChild(grid);
            new ErrorToolTip(this.id).addChangeListener();
        }
        input.value = String(this.value);
    }
}
var CustTable = [
    new CustEntry("commonCpuBoostClock", "Boost Clock in kHz", CustPlatform.All, 4, ["System default: 1785000",
        "Boost clock will be applied when applications request Boost Mode via performance configuration."], 1785000, [1020000, 3000000], 1, false),
    new CustEntry("marikoCpuUV", "Enable Mariko CPU Undervolt", CustPlatform.Mariko, 4, ["Reduce CPU power draw",
        "<b>0</b> : Default Table",
        "<b>1</b> : Undervolt Level 1 (SLT - CPU speedo < 1650)",
        "<b>2</b> : Undervolt Level 1 (SLT - CPU speedo >= 1650)",
        "<b>3</b> : Undervolt Level 2 (OCT - OCS custom undervolt)",
        "<b>4</b> : Undervolt Level 3 (HiOCT - OCS custom undervolt)",], 0, [0, 4], 1),
    new CustEntry("eristaCpuMinVolt", "Erista CPU Min Voltage in mV", CustPlatform.Erista, 4, ["Acceptable range: 0 < x ≤ 1227",
        "System Default: 825"], 825, [0, 1227], 1),
    new CustEntry("eristaCpuMaxVolt", "Erista CPU Max Voltage in mV", CustPlatform.Erista, 4, ["Acceptable range: 1227 ≤ x ≤ 1300",
        "System Default: 1227, L4T OC: 1257"], 1257, [1227, 1300], 1),
    new CustEntry("marikoCpuMinVolt", "Mariko CPU Min Voltage in mV", CustPlatform.Mariko, 4, ["Acceptable range: 0 < x ≤ 1120",
        "System Default: 620"], 620, [0, 1120], 5),
    new CustEntry("marikoCpuHighMinVolt", "Mariko CPU High Min Voltage in mV", CustPlatform.Mariko, 4, ["Acceptable range: 0 < x ≤ 1120",
        "System Default: 850"], 850, [0, 1120], 5),
    new CustEntry("marikoCpuMaxVolt", "Mariko CPU Max Voltage in mV", CustPlatform.Mariko, 4, ["Acceptable range: 1120 ≤ x ≤ 1300",
        "System default: 1120, L4T OC: 1235",
        "Changing this value affects cpu voltage calculation"], 1235, [1120, 1300], 5),
    new CustEntry("marikoGpuUV", "Enable Mariko GPU Undervolt", CustPlatform.Mariko, 4, ["Reduce GPU power draw",
        "Your GPU might not withstand undervolt, and can hang your console, or crash games",
        "Undervolting too much will drop GPU performance even if it seems stable",
        "GPU voltages are dynamic and will change with temperature and gpu speedo",
        "<b>0</b> : Default Table",
        "<b>1</b> : Undervolt Level 1 (SLT: Aggressive)",
        "<b>2</b> : Undervolt Level 2 (HiOPT: Drastic)",
        "<b>3</b> : Custom static GPU Voltage Table (Use Gpu Configuation below)"], 0, [0, 3], 1),
    new CustEntry("commonGpuVoltOffset", "GPU Volt Offset", CustPlatform.All, 4, ["Negative Voltage offset value for gpu dynamic voltage calculation",
        "For example, value of 10 will decrease 10mV gpu volt from all frequencies",
        "Default gpu vmin: Erista - 810mV / Mariko - 610mV",
        "Acceptable range: 0 ~ 100"], 0, [0, 100], 1),
    new CustEntry("eristaGpuMinVolt", "Erista GPU Vmin", CustPlatform.Erista, 4, ["GPU Vmin for Erista",
        "Default gpu vmin: 810mV",
        "Regulator step: 6.25mV",
        "With 810mV vmin, 812.mV will be used because of 6.25mV regulator step",
        "Acceptable range: 0 ~ 1000"], 810, [0, 1132], 1),
    new CustEntry("marikoGpuMinVolt", "Mariko GPU Vmin", CustPlatform.Mariko, 4, ["GPU Vmin for Mariko",
        "High EMC Clocks will require gpu minimum voltage to be raised",
        "Default gpu vmin: 610mV",
        "Regulator step: 5mV",
        "slt and hiopt uses 590mV as minimum voltage",
        "Acceptable range: 0 ~ 800"], 610, [0, 800], 5),
    new CustEntry("marikoGpuMaxVolt", "Mariko GPU Vmax", CustPlatform.Mariko, 4, ["GPU Vmax for Mariko",
        "System Default: 1050, L4T: 800",
        "Not recommended to adjust value",
        "GPU Frequency having higher than vmax in any temp range will be automatically removed",
        "Which means GPU max freq will be adjusted depending on your speedo",
        "Acceptable range: 800 ~ 1050"], 800, [800, 1050], 5),
    new CustEntry("mtcConf", "DRAM Timing", CustPlatform.All, 4, ["<b>0</b>: AUTO_ADJ_ALL: Auto adjust mtc table with LPDDR4 3733 Mbps specs, 8Gb density. Change timing with Advanced Config (Default)",
        "<b>1</b>: CUSTOM_ADJ_ALL: Adjust only non-zero preset timings in Advanced Config",
        "<b>2</b>: NO_ADJ_ALL: Use 1600 mtc table wihout adjusting (Timing becomes tighter if you raise dram clock)."], 0, [0, 2], 1),
    new CustEntry("commonEmcMemVolt", "EMC Vdd2 Voltage in uV", CustPlatform.All, 4, ["Acceptable range: 1050000 ≤ x ≤ 1212500, and it should be divided evenly by 12500.",
        "Erista Default: 1125000",
        "Mariko Default: 1100000",
        "Official lpddr4(x) range: 1060mV~1175mV (1100mV nominal)",
        "OCS need high voltage unlike l4t because of not scaling mtc table well. However it is recommended to stay within official limits",
        "Not enabled by default"], 0, [1050000, 1212500], 12500),
    new CustEntry("marikoEmcVddqVolt", "EMC Vddq (Mariko Only) Voltage in uV", CustPlatform.Mariko, 4, ["Acceptable range: 550000 ≤ x ≤ 650000",
        "Value should be divided evenly by 5000",
        "Default: 600000",
        "Official lpddr4(x) range: 570mV~650mV (600mV nominal)",
        "Not enabled by default."], 0, [550000, 650000], 5000),
    new CustEntry("eristaEmcMaxClock", "Erista RAM Max Clock in kHz", CustPlatform.Erista, 4, ["Values should be ≥ 1600000, and divided evenly by 3200.",
        "Actual dram clock might be different from this value.",
        "Recommended Clocks: 1862400, 2131200 (JEDEC)",
        "<b>WARNING:</b> RAM overclock could be UNSTABLE if timing parameters are not suitable for your DRAM"], 1862400, [1600000, 2131200], 3200),
    new CustEntry("marikoEmcMaxClock", "Mariko RAM Max Clock in kHz", CustPlatform.Mariko, 4, ["Values should be ≥ 1600000, and accepts any integer.",
        "Actual dram clock is exactly same as this value.",
        "Spread Spectrum is enabled for frequencies in range of (2366000, 2500000] to mitigate EMI with wifi.",
        "Recommended Clocks: 1866000, 2133000, 2400000 (JEDEC)",
        "Example Clocks: 1866000, 1966000, 2133000, 2233000, 2333000, 2533000",
        "<b>WARNING:</b> RAM overclock could be UNSTABLE if timing parameters are not suitable for your DRAM."], 1966000, [1600000, 2566000], 1),
    new CustEntry("commonEmcDvbShift", "EMC DVB Table Shift", CustPlatform.All, 4, ["SoC voltage automatically gets raised with higher dram clock",
        "Each shift number raises 25mV more, up to max SoC voltage",
        "Helps with stability at higher memory clock",
        "Acceptable range : 0~4"], 0, [0, 4], 1),
];
var AdvTable = [
    new AdvEntry("ramTimingPresetOne", "Primary RAM Timing Preset", CustPlatform.Mariko, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "Select Timing Preset for both AUTO_ADJ and CUSTOM_ADJ",
        "Values are : tRCD - tRP - tRAS (tRC = tRP + tRAS)",
        "<b>0</b> : Do Not Adjust (with CUST_ADJ at 2400Mhz, timing becomes: 12 - 12 - 28)",
        "<b>1</b> : 18 - 18 - 42 (Default timing)",
        "<b>2</b> : 17 - 17 - 39",
        "<b>3</b> : 16 - 16 - 36",
        "<b>4</b> : 15 - 15 - 34",
        "<b>5</b> : 14 - 14 - 32",
        "<b>6</b> : 13 - 13 - 30"], 1, [0, 6], 1),
    new AdvEntry("ramTimingPresetTwo", "Secondary RAM Timing Preset", CustPlatform.Mariko, 4, ["WARNING: Unstable timings can corrupt your nand",
        "Secondary Timing Preset for both AUTO_ADJ and CUSTOM_ADJ",
        "Values are : tRRD - tFAW",
        "<b>0</b> : Do Not Adjust (with CUST_ADJ at 2400Mhz, timing becomes: 6.6 - 26.6) (CUST_ADJ only)",
        "<b>1</b> : 10 - 40 (Default timing) (3733 specs)",
        "<b>2</b> : 7.5 - 30 (4266 specs)",
        "<b>3</b> : 6 - 24",
        "<b>4</b> : 4 - 16",
        "<b>5</b> : 3 - 12",], 1, [0, 5], 1),
    new AdvEntry("ramTimingPresetThree", "Secondary RAM Timing Preset", CustPlatform.Mariko, 4, ["WARNING: Unstable timings can corrupt your nand",
        "Secondary Timing Preset for both AUTO_ADJ and CUSTOM_ADJ",
        "Values are : tWR - tRTP",
        "<b>0</b> : Do Not Adjust (with CUST_ADJ at 2400Mhz, timing becomes: ?? - 5) (CUST_ADJ only)",
        "<b>1</b> : 18 - 7.5 (Default timing)",
        "<b>2</b> : 15 - 7.5",
        "<b>3</b> : 15 - 6",
        "<b>4</b> : 12 - 6",
        "<b>5</b> : 12 - 4",
        "<b>6</b> : 8 - 4",], 1, [0, 6], 1),
    new AdvEntry("ramTimingPresetFour", "Secondary RAM Timing Preset", CustPlatform.Mariko, 4, ["WARNING: Unstable timings can corrupt your nand",
        "Secondary Timing Preset for both AUTO_ADJ and CUSTOM_ADJ",
        "Values are : tRFC",
        "<b>0</b> : Do Not Adjust (with CUST_ADJ at 2400Mhz, timing becomes: 93.3) (CUST_ADJ only)",
        "<b>1</b> : 140 (Default timing)",
        "<b>2</b> : 120",
        "<b>3</b> : 100",
        "<b>4</b> : 80",
        "<b>5</b> : 70",
        "<b>6</b> : 60",], 1, [0, 6], 1),
    new AdvEntry("ramTimingPresetFive", "Secondary RAM Timing Preset", CustPlatform.Mariko, 4, ["WARNING: Unstable timings can corrupt your nand",
        "Secondary Timing Preset for both AUTO_ADJ and CUSTOM_ADJ",
        "Values are : tWTR",
        "<b>0</b> : Do Not Adjust (with CUST_ADJ at 2400Mhz, timing becomes: ??) (CUST_ADJ only)",
        "<b>1</b> : 10 (Default timing)",
        "<b>2</b> : 8",
        "<b>3</b> : 6",
        "<b>4</b> : 4",
        "<b>5</b> : 2",
        "<b>6</b> : 1",], 1, [0, 6], 1),
    new AdvEntry("ramTimingPresetSix", "Tertiary RAM Timing Preset", CustPlatform.Mariko, 4, ["WARNING: Unstable timings can corrupt your nand",
        "Tertiary Timing Preset for both AUTO_ADJ and CUSTOM_ADJ",
        "Values are : tREFI",
        "NOT RECOMMENDED FOR ERISTA",
        "<b>0</b> : Do Not Adjust",
        "<b>1</b> : 1x REFI (Default timing)",
        "<b>2</b> : 1.5x REFI",
        "<b>3</b> : 2x REFI",
        "<b>4</b> : 3x REFI",
        "<b>5</b> : 4x REFI",
        "<b>6</b> : MAX REFI",], 1, [0, 6], 1),
    new AdvEntry("ramTimingPresetSeven", "Latency Decrement", CustPlatform.Mariko, 4, ["WARNING: Unstable timings can corrupt your nand",
        "Latency decrement for both AUTO_ADJ and CUSTOM_ADJ",
        "This preset decreases Write/Read related delays. Values are Write - Read",
        "<b>0</b> : 0 - 0, Do Not Adjust for CUST_ADJ",
        "<b>1</b> : '-2' - '-4'",
        "<b>2</b> : '-4' - '-8'",
        "<b>3</b> : '-6' - '-12'",
        "<b>4</b> : '-8' - '-16'",
        "<b>5</b> : '-10' - '-20'",
        "<b>6</b> : '-12' - '-24'",], 0, [0, 6], 1)
];
var GpuTable = [
    new GpuEntry("0", "76.8"),
    new GpuEntry("1", "153.6"),
    new GpuEntry("2", "230.4"),
    new GpuEntry("3", "307.2"),
    new GpuEntry("4", "384.0"),
    new GpuEntry("5", "460.8"),
    new GpuEntry("6", "537.6"),
    new GpuEntry("7", "614.4"),
    new GpuEntry("8", "691.2"),
    new GpuEntry("9", "768.0"),
    new GpuEntry("10", "844.8"),
    new GpuEntry("11", "921.6"),
    new GpuEntry("12", "998.4"),
    new GpuEntry("13", "1075.2"),
    new GpuEntry("14", "1152.0"),
    new GpuEntry("15", "1228.8"),
    new GpuEntry("16", "1267.2"),
];
class ErrorToolTip {
    constructor(id, msg) {
        this.id = id;
        this.msg = msg;
        this.id = id;
        this.element = document.getElementById(id);
        if (msg) {
            this.setMsg(msg);
        }
    }
    ;
    setMsg(msg) {
        this.msg = msg;
        return this;
    }
    show() {
        var _a, _b, _c, _d, _e, _f;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.setAttribute("aria-invalid", "true");
        if (this.msg) {
            (_b = this.element) === null || _b === void 0 ? void 0 : _b.setAttribute("title", this.msg);
            (_d = (_c = this.element) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.setAttribute("data-tooltip", this.msg);
            (_f = (_e = this.element) === null || _e === void 0 ? void 0 : _e.parentElement) === null || _f === void 0 ? void 0 : _f.setAttribute("data-placement", "top");
        }
        return this;
    }
    ;
    clear() {
        var _a, _b, _c, _d, _e, _f;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.removeAttribute("aria-invalid");
        (_b = this.element) === null || _b === void 0 ? void 0 : _b.removeAttribute("title");
        (_d = (_c = this.element) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.removeAttribute("data-tooltip");
        (_f = (_e = this.element) === null || _e === void 0 ? void 0 : _e.parentElement) === null || _f === void 0 ? void 0 : _f.removeAttribute("data-placement");
        return this;
    }
    addChangeListener() {
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener('change', (_evt) => {
            let obj = CustTable.filter((obj) => { return obj.id === this.id; })[0];
            obj.value = Number(this.element.value);
            obj.validate();
        });
    }
}
;
class CustStorage {
    constructor() {
        this.storage = {};
        this.key = "last_saved";
    }
    updateFromTable() {
        let update = (i => {
            var _a;
            i.updateValueFromElement();
            if (!i.validate()) {
                (_a = i.getInputElement()) === null || _a === void 0 ? void 0 : _a.focus();
                throw new Error(`Invalid ${i.name}`);
            }
        });
        CustTable.forEach(update);
        AdvTable.forEach(update);
        GpuTable.forEach(update);
        this.storage = {};
        let kv = Object.fromEntries(CustTable.map((i) => [i.id, i.value]));
        Object.keys(kv)
            .forEach(k => this.storage[k] = kv[k]);
        kv = Object.fromEntries(AdvTable.map((i) => [i.id, i.value]));
        Object.keys(kv)
            .forEach(k => this.storage[k] = kv[k]);
    }
    setTable() {
        let keys = Object.keys(this.storage);
        keys.forEach(k => CustTable.filter(i => i.id == k)[0].value = this.storage[k]);
        keys.forEach(k => AdvTable.filter(i => i.id == k)[0].value = this.storage[k]);
        // Set default for missing values
        CustTable.filter(i => !keys.includes(i.id))
            .forEach(i => i.value = i.defval);
        AdvTable.filter(i => !keys.includes(i.id))
            .forEach(i => i.value = i.defval);
        CustTable.forEach(i => {
            var _a;
            if (!i.validate()) {
                (_a = i.getInputElement()) === null || _a === void 0 ? void 0 : _a.focus();
                throw new Error(`Invalid ${i.name}`);
            }
            i.setElementValue();
        });
        AdvTable.forEach(i => {
            var _a;
            if (!i.validate()) {
                (_a = i.getInputElement()) === null || _a === void 0 ? void 0 : _a.focus();
                throw new Error(`Invalid ${i.name}`);
            }
            i.setElementValue();
        });
        GpuTable.forEach(i => {
            var _a;
            if (!i.validate()) {
                (_a = i.getInputElement()) === null || _a === void 0 ? void 0 : _a.focus();
                throw new Error(`Invalid ${i.name}`);
            }
            i.setElementValue();
        });
    }
    save() {
        localStorage.setItem(this.key, JSON.stringify(this.storage));
    }
    load() {
        let s = localStorage.getItem(this.key);
        if (!s) {
            return null;
        }
        let dict = JSON.parse(s);
        let keys = CustTable.map(i => i.id);
        let ignoredKeys = Object.keys(dict).filter(k => !keys.includes(k));
        if (ignoredKeys.length) {
            console.log(`Ignored: ${ignoredKeys}`);
        }
        Object.keys(dict)
            .filter(k => keys.includes(k))
            .forEach(k => this.storage[k] = dict[k]);
        keys = AdvTable.map(i => i.id);
        ignoredKeys = Object.keys(dict).filter(k => !keys.includes(k));
        if (ignoredKeys.length) {
            console.log(`Ignored: ${ignoredKeys}`);
        }
        Object.keys(dict)
            .filter(k => keys.includes(k))
            .forEach(k => this.storage[k] = dict[k]);
        return this.storage;
    }
}
class Cust {
    constructor() {
        this.storage = new CustStorage();
        this.magic = 0x54535543; // "CUST"
        this.magicLen = 4;
        this.mapper = {
            2: {
                get: (offset) => this.view.getUint16(offset, true),
                set: (offset, value) => this.view.setUint16(offset, value, true),
            },
            4: {
                get: (offset) => this.view.getUint32(offset, true),
                set: (offset, value) => this.view.setUint32(offset, value, true)
            },
        };
    }
    findMagicOffset() {
        this.view = new DataView(this.buffer);
        for (let offset = 0; offset < this.view.byteLength; offset += this.magicLen) {
            if (this.mapper[this.magicLen].get(offset) == this.magic) {
                this.beginOffset = offset;
                return;
            }
        }
        throw new Error("Invalid loader.kip file");
    }
    save() {
        this.storage.updateFromTable();
        let saveValue = (i => {
            var _a, _b;
            if (!i.offset) {
                (_a = i.getInputElement()) === null || _a === void 0 ? void 0 : _a.focus();
                throw new Error(`Failed to get offset for ${i.name}`);
            }
            let mapper = this.mapper[i.size];
            if (!mapper) {
                (_b = i.getInputElement()) === null || _b === void 0 ? void 0 : _b.focus();
                throw new Error(`Unknown size at ${i.name}`);
            }
            mapper.set(i.offset, i.value);
        });
        CustTable.forEach(saveValue);
        AdvTable.forEach(saveValue);
        GpuTable.forEach(saveValue);
        this.storage.save();
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([this.buffer], { type: "application/octet-stream" }));
        a.download = "loader.kip";
        a.click();
        this.toggleLoadLastSavedBtn(true);
    }
    removeHTMLForm() {
        CustTable.forEach(i => i.removeElement());
    }
    toggleLoadLastSavedBtn(enable) {
        let last_btn = document.getElementById("load_saved");
        if (enable) {
            last_btn.addEventListener('click', () => {
                if (this.storage.load()) {
                    this.storage.setTable();
                }
            });
            last_btn.style.removeProperty("display");
            last_btn.removeAttribute("disabled");
        }
        else {
            last_btn.style.setProperty("display", "none");
        }
    }
    createHTMLForm() {
        var _a, _b;
        CustTable.forEach(i => i.createElement());
        let advanced = document.createElement("p");
        advanced.innerHTML = "Advanced configuration";
        (_a = document.getElementById("config-list-advanced")) === null || _a === void 0 ? void 0 : _a.appendChild(advanced);
        let gpu = document.createElement("p");
        gpu.innerHTML = "Gpu Volt configuration";
        (_b = document.getElementById("config-list-gpu")) === null || _b === void 0 ? void 0 : _b.appendChild(gpu);
        AdvTable.forEach(i => i.createElement());
        GpuTable.forEach(i => i.createElement());
        let default_btn = document.getElementById("load_default");
        default_btn.removeAttribute("disabled");
        default_btn.addEventListener('click', () => {
            CustTable.forEach(i => i.setElementDefaultValue());
        });
        this.toggleLoadLastSavedBtn(this.storage.load() !== null);
        let save_btn = document.getElementById("save");
        save_btn.removeAttribute("disabled");
        save_btn.addEventListener('click', () => {
            try {
                this.save();
            }
            catch (e) {
                console.error(e);
                alert(e);
            }
        });
    }
    initCustTabs() {
        const custTabs = Array.from(document.querySelectorAll(`nav[role="tablist"] > button`));
        custTabs.forEach(tab => {
            tab.removeAttribute("disabled");
            let platform = Number(tab.getAttribute("data-platform"));
            tab.addEventListener('click', (_evt) => {
                // Set other tabs to unfocused state
                const unfocusedClasses = ["outline"];
                tab.classList.remove(...unfocusedClasses);
                let otherTabs = custTabs.filter(j => j != tab);
                otherTabs.forEach(k => k.classList.add(...unfocusedClasses));
                CustTable.forEach(e => {
                    e.isAvailableFor(platform) ? e.showElement() : e.hideElement();
                });
            });
        });
    }
    parse() {
        let offset = this.beginOffset + this.magicLen;
        let revLen = 4;
        this.rev = this.mapper[revLen].get(offset);
        if (this.rev != CUST_REV_ADV) {
            throw new Error(`Unsupported custRev, expected: ${CUST_REV_ADV}, got ${this.rev}`);
        }
        offset += revLen;
        document.getElementById("cust_rev").innerHTML = `Cust v${this.rev} is loaded.`;
        let loadValue = (i => {
            var _a;
            i.offset = offset;
            let mapper = this.mapper[i.size];
            if (!mapper) {
                (_a = i.getInputElement()) === null || _a === void 0 ? void 0 : _a.focus();
                throw new Error(`Unknown size at ${i}`);
            }
            i.value = mapper.get(offset);
            offset += i.size;
            i.validate();
        });
        CustTable.forEach(loadValue);
        AdvTable.forEach(loadValue);
        GpuTable.forEach(loadValue);
    }
    load(buffer) {
        try {
            this.buffer = buffer;
            this.findMagicOffset();
            this.removeHTMLForm();
            this.parse();
            this.initCustTabs();
            this.createHTMLForm();
        }
        catch (e) {
            console.error(e);
            alert(e);
        }
    }
}
/* GitHub Release fetch */
class ReleaseAsset {
    constructor(obj) {
        this.downloadUrl = obj.browser_download_url;
        this.updatedAt = obj.updated_at;
    }
    ;
}
;
class ReleaseInfo {
    constructor() {
        this.ocLatestApi = "https://api.github.com/repos/hanai3Bi/Switch-OC-Suite/releases/latest";
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.parseOcResponse(yield this.responseFromApi(this.ocLatestApi).catch());
            }
            catch (e) {
                console.error(e);
                alert(e);
            }
        });
    }
    ;
    responseFromApi(apiUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(apiUrl, { method: 'GET', headers: { Accept: 'application/json' } });
            if (response.ok) {
                return yield response.json();
            }
            throw new Error(`Failed to connect to "${apiUrl}": ${response.status}`);
        });
    }
    ;
    parseOcResponse(response) {
        this.ocVer = response.tag_name;
        this.loaderKipAsset = new ReleaseAsset(response.assets.filter(a => a.name.endsWith("loader.kip"))[0]);
        this.sdOutZipAsset = new ReleaseAsset(response.assets.filter(a => a.name.endsWith("SdOut.zip"))[0]);
        this.sysclkOCAsset = new ReleaseAsset(response.assets.filter(a => a.name.endsWith("sys-clk-oc.zip"))[0]);
    }
    ;
}
;
class DownloadSection {
    constructor() {
        this.element = document.getElementById("download_btn_grid");
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this.isVisible()) {
                yield new Promise(r => setTimeout(r, 1000));
            }
            const info = new ReleaseInfo();
            yield info.load();
            this.update("loader_kip_btn", `loader.kip <b>${info.ocVer}</b><br>${info.loaderKipAsset.updatedAt}`, info.loaderKipAsset.downloadUrl);
            this.update("sdout_zip_btn", `SdOut.zip <b>${info.ocVer}</b><br>${info.sdOutZipAsset.updatedAt}`, info.sdOutZipAsset.downloadUrl);
            this.update("ams_btn", `sys-clk-oc <b>${info.ocVer}</b><br>${info.sysclkOCAsset.updatedAt}`, info.sysclkOCAsset.downloadUrl);
        });
    }
    isVisible() {
        let rect = this.element.getBoundingClientRect();
        return (rect.top > 0 &&
            rect.left > 0 &&
            rect.bottom - rect.height < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right - rect.width < (window.innerWidth || document.documentElement.clientWidth));
    }
    update(id, name, url) {
        let element = document.getElementById(id);
        element.innerHTML = name;
        element.removeAttribute("aria-busy");
        element.setAttribute("href", url);
    }
}
const fileInput = document.getElementById("file");
fileInput.addEventListener('change', (event) => {
    var cust = new Cust();
    // User canceled or non files selected
    if (!event.target || !event.target.files) {
        return;
    }
    let reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onloadend = (progEvent) => {
        if (progEvent.target.readyState == FileReader.DONE) {
            cust.load(progEvent.target.result);
        }
    };
});
addEventListener('DOMContentLoaded', (_evt) => __awaiter(this, void 0, void 0, function* () {
    yield new DownloadSection().load();
}));
