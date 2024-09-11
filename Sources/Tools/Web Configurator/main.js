const CUST_REV_ADV = 45;
var CustPlatform;
(function(CustPlatform) {
    CustPlatform[CustPlatform["Undefined"] = 0] = "Undefined";
    CustPlatform[CustPlatform["Erista"] = 1] = "Erista";
    CustPlatform[CustPlatform["Mariko"] = 2] = "Mariko";
    CustPlatform[CustPlatform["All"] = 3] = "All";
})(CustPlatform || (CustPlatform = {}));;
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
    };
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
    };
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
class GpuVoltEntry extends CustEntry {
    constructor(id, name, platform = CustPlatform.Mariko, size = 4, desc = ["range: 500 ≤ x ≤ 1050"], defval = 610, minmax = [500, 1050], step = 5, zeroable = false) {
        super(id, name, platform, size, desc, defval, minmax, step, zeroable);
        this.id = id;
        this.name = name;
        this.platform = platform;
        this.size = size;
        this.desc = desc;
        this.defval = defval;
        this.step = step;
        this.zeroable = zeroable;
    };
    createElement() {
        let input = this.getInputElement();
        if (!input) {
            let grid = document.createElement("div");
            grid.classList.add("grid", "cust-element");
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
            let desc = document.createElement("blockquote");
            desc.innerHTML = "<ul>" + this.desc.map(i => `<li>${i}</li>`).join('') + "</ul>";
            desc.setAttribute("for", this.id);
            grid.appendChild(desc);
            document.getElementById("config-list-gpuvolt").appendChild(grid);
            new ErrorToolTip(this.id).addChangeListener();
        }
        input.value = String(this.value);
    }
}

var CpuTable = [
    new CustEntry("commonCpuBoostClock", "Boost Clock in kHz", CustPlatform.All, 4, ["System default: 1785000", "This value patches Boost Mode CPU clock"], 1785000, [1020000, 3000000], 1, false),
    new CustEntry("commonCpuUV", "CPU Undervolt", CustPlatform.All, 4, ["<b>0</b> : Default Table", "Acceptable range mariko : 0 - 8", "Acceptable range erista : 0 - 5"], 0, [0, 8], 1),
    new CustEntry("eristaCpuMinVolt", "Erista CPU Min Voltage in mV", CustPlatform.Erista, 4, ["Acceptable range: 750 ≤ x ≤ 850", "System Default: 825"], 800, [750, 850], 25),
    new CustEntry("eristaCpuMaxVolt", "Erista CPU Max Voltage in mV", CustPlatform.Erista, 4, ["Acceptable range: 1200 ≤ x ≤ 1257", "System Default: 1227, L4T OC: 1257", "Changing this value affects cpu voltage calculation"], 1257, [1200, 1257], 1),
    new CustEntry("marikoCpuMinVolt", "Mariko CPU Min Voltage in mV", CustPlatform.Mariko, 4, ["Acceptable range: 550 < x ≤ 1120", "System Default: 620"], 620, [550, 1120], 5),
    new CustEntry("marikoCpuHighMinVolt", "Mariko CPU Tune High Min Voltage in mV", CustPlatform.Mariko, 4, ["Acceptable range: 710 ≤ x ≤ 850", "System Default: 850"], 850, [710, 850], 5),
    new CustEntry("marikoCpuMaxVolt", "Mariko CPU Max Voltage in mV", CustPlatform.Mariko, 4, ["Acceptable range: 1100 ≤ x ≤ 1160", "System default: 1120, L4T OC: 1235", "Changing this value affects cpu voltage calculation"], 1125, [1100, 1160], 5),
];

var GpuTable = [
    new CustEntry("eristaGpuUV", "Erista GPU Undervolt", CustPlatform.Erista, 4, ["GPU voltages are dynamic and will change with temperature and gpu speedo", "<b>0</b> : Undervolt Level 0 (Default Table)", "<b>1</b> : Undervolt Level 1 (M static +30mV)", "<b>2</b> : Undervolt Level 2 (high UV table)", "<b>3</b> : Custom static GPU Voltage Table (Use Gpu Configuator below)"], 0, [0, 3], 1),
    new CustEntry("marikoGpuUV", "Mariko GPU Undervolt", CustPlatform.Mariko, 4, ["GPU voltages are dynamic and will change with temperature and gpu speedo", "<b>0</b> : Undervolt Level 0 (HiOPT)", "<b>1</b> : Undervolt Level 1 (HiOPT -15mV(2))", "<b>2</b> : Undervolt Level 2 (high UV table)", "<b>3</b> : Custom static GPU Voltage Table (Use Gpu Configuator below)"], 0, [0, 3], 1),
    new CustEntry("commonGpuVoltOffset", "GPU Volt Offset", CustPlatform.All, 4, ["Negative Offset value for gpu dynamic voltage calculation", "For example, value of 10 will decrease 10mV gpu volt from all frequencies", "Default gpu vmin: Erista - 810mV / Mariko - 610mV", "Acceptable range: 0 ~ 50"], 0, [0, 50], 1),
    new CustEntry("eristaGpuMinVolt", "Erista GPU Vmin", CustPlatform.Erista, 4, ["GPU Vmin for Erista", "Default gpu vmin: 810mV", "Regulator step: 6.25mV", "With 810mV vmin, 812.mV will be lowest voltage because of 6.25mV regulator step", "Acceptable range: 0 ~ 1132"], 810, [0, 1132], 1),
    new CustEntry("marikoGpuSpeedo", "Mariko GPU Speedo", CustPlatform.Mariko, 4, ["GPU Speedo for Mariko"], 1660, [1480, 1800], 5),
    new CustEntry("marikoGpuMinVolt", "Mariko GPU Vmin", CustPlatform.Mariko, 4, ["GPU Vmin for Mariko", "High EMC Clocks will require gpu minimum voltage to be raised", "Default gpu vmin: 610mV", "Regulator step: 5mV", "slt and hiopt uses 590mV as minimum voltage", "Acceptable range: 0 ~ 800"], 610, [0, 800], 5),
    new CustEntry("marikoGpuMaxVolt", "Mariko GPU Vmax", CustPlatform.Mariko, 4, ["GPU Vmax for Mariko", "System Default: 850, L4T: 800", "Not recommended to increase value in order to protect from going over gpu pmic limits", "Recommended limit: 800mV@1228Mhz with HiOPT", "Any GPU Frequency that needs higher than vmax will be automatically removed and not available", "This means max available GPU freq will be adjusted depending on your speedo", "Acceptable range: 800 ~ 850"], 800, [800, 850], 5),
];

var RamTable = [
    new CustEntry("mtcConf", "DRAM Timing", CustPlatform.All, 4, ["<b>0</b>: AUTO_ADJ: Auto adjust mtc table with LPDDR4 3733 Mbps specs, 16Gb density. Change timing with Advanced Config (Default)", "<b>3</b>: NO_ADJ: Use 1600 mtc table wihout adjusting (Timing becomes tighter if you raise dram clock)."], 0, [0, 3], 1),
    new CustEntry("commonEmcMemVolt", "EMC Vdd2 Voltage in uV", CustPlatform.All, 4, ["Acceptable range: 1050000 ≤ x ≤ 1212500, and it should be divided evenly by 12500.", "Erista Default: 1125000", "Mariko Default: 1100000", "Official lpddr4(x) range: 1060mV~1175mV (1100mV nominal)", "OCS need high voltage unlike l4t because of not scaling mtc table well. However it is recommended to stay within official limits", "Not enabled by default"], 0, [1050000, 1212500], 12500),
    new CustEntry("marikoEmcVddqVolt", "EMC Vddq (Mariko Only) Voltage in uV", CustPlatform.Mariko, 4, ["Acceptable range: 550000 ≤ x ≤ 650000", "Value should be divided evenly by 5000", "Default: 600000", "Official lpddr4(x) range: 570mV~650mV (600mV nominal)", "Not enabled by default."], 0, [550000, 650000], 5000),
    new CustEntry("eristaEmcMaxClock", "Erista RAM Max Clock in kHz", CustPlatform.Erista, 4, ["Values should be ≥ 1600000, and divided evenly by 9600.", "Recommended Clocks: 1862400, 2131200 (JEDEC)"], 1862400, [1600000, 2600000], 9600),
    new CustEntry("marikoEmcMaxClock", "Mariko RAM Max Clock in kHz", CustPlatform.Mariko, 4, ["Values should be ≥ 1600000, and accepts any natural number.", "Actual dram clock is exactly same as this value.", "Spread Spectrum is enabled for frequencies in range of (2366000, 2500000] to mitigate EMI with wifi(2.4Ghz).", "Recommended Clocks: 1866000, 2133000, 2400000, 2533000, 2666000, ..."], 1966000, [1600000, 3200000], 1),
    new CustEntry("commonEmcDvbShift", "EMC DVB Voltage Shift", CustPlatform.All, 4, ["EMC DVB table is EMC clock to SOC voltage mapping", "SOC voltage automatically gets raised on higher emc clock with this table", "Each shift number raises 25mV more, up to max SoC voltage. Leave at 0 and only raise if unstable", "Acceptable range : 0~5"], 0, [0, 5], 1),
];

var AdvTable = [
    new AdvEntry("ramTimingTRCD", "T1 tRCD", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "<b>0</b> : 18 (Default timing)",
        "<b>1</b> : 17",
        "<b>2</b> : 16",
        "<b>3</b> : 15",
        "<b>4</b> : 14",
        "<b>5</b> : 13",
        "<b>6</b> : 12",
        "<b>7</b> : 11",
    ], 0, [0, 7], 1),
    new AdvEntry("ramTimingTRP", "T2 tRP", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "<b>0</b> : 18 (Default timing)",
        "<b>1</b> : 17",
        "<b>2</b> : 16",
        "<b>3</b> : 15",
        "<b>4</b> : 14",
        "<b>5</b> : 13",
        "<b>6</b> : 12",
        "<b>7</b> : 11",
    ], 0, [0, 7], 1),
    new AdvEntry("ramTimingTRAS", "T3 tRAS", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "Acceptable range: 19 ≤ x ≤ 42",
        "<b>0</b> : 42 (Default timing)",
        "<b>1</b> : 39",
        "<b>2</b> : 36",
        "<b>3</b> : 33",
        "<b>4</b> : 30",
        "<b>5</b> : 28",
        "<b>6</b> : 26",
        "<b>7</b> : 24",
        "<b>8</b> : 22",
        "<b>9</b> : 20",
    ], 0, [0, 9], 1),
    new AdvEntry("ramTimingTRRD", "T4 tRRD", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "<b>0</b> : 10 (Default timing)",
        "<b>1</b> : 7.5",
        "<b>2</b> : 6",
        "<b>3</b> : 5",
        "<b>4</b> : 4",
        "<b>5</b> : 3",
        "<b>6</b> : 2",
        "<b>7</b> : 1",
    ], 0, [0, 7], 1),
    new AdvEntry("ramTimingTRFC", "T5 tRFC", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "<b>0</b> : 140 (Default timing)",
        "<b>1</b> : 120",
        "<b>2</b> : 100",
        "<b>3</b> : 90",
        "<b>4</b> : 80",
        "<b>5</b> : 70",
        "<b>6</b> : 60",
        "<b>7</b> : 50",
        "<b>8</b> : 40",
    ], 0, [0, 8], 1),
    new AdvEntry("ramTimingTRTW", "T6 tRTW", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "Values are : tRTW",
        "<b>0</b> (Default timing)",
        "<b>1</b>",
        "<b>2</b>",
        "<b>3</b>",
        "<b>4</b>",
        "<b>5</b>",
        "<b>6</b>",
        "<b>7</b>",
        "<b>8</b>",
        "<b>9</b>",
    ], 0, [0, 9], 1),
    new AdvEntry("ramTimingTWTR", "T7 tWTR", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "Values are : tWTR",
        "<b>0</b> : 10 (Default timing)",
        "<b>1</b> : 9",
        "<b>2</b> : 8",
        "<b>3</b> : 7",
        "<b>4</b> : 6",
        "<b>5</b> : 5",
        "<b>6</b> : 4",
        "<b>7</b> : 3",
        "<b>8</b> : 2",
        "<b>9</b> : 1",
    ], 0, [0, 9], 1),
    new AdvEntry("ramTimingTREFI", "T8 tREFI", CustPlatform.All, 4, ["<b>WARNING</b>: Unstable timings can corrupt your nand",
        "<b>0</b> : 1x REFI (3900us) (Default timing)",
        "<b>1</b> : 1.5x REFI",
        "<b>2</b> : 2x REFI",
        "<b>3</b> : 3x REFI",
        "<b>4</b> : 4x REFI",
        "<b>5</b> : MAX REFRESH (2400: 7x REFI / 2666: 6.3x REFI / 2933: 5.7x REFI /...",
    ], 0, [0, 5], 1),
];
var GpuVoltTable = [
    new GpuVoltEntry("0", "76.8"),
    new GpuVoltEntry("1", "153.6"),
    new GpuVoltEntry("2", "230.4"),
    new GpuVoltEntry("3", "307.2"),
    new GpuVoltEntry("4", "384.0"),
    new GpuVoltEntry("5", "460.8"),
    new GpuVoltEntry("6", "537.6"),
    new GpuVoltEntry("7", "614.4"),
    new GpuVoltEntry("8", "691.2"),
    new GpuVoltEntry("9", "768.0"),
    new GpuVoltEntry("10", "844.8"),
    new GpuVoltEntry("11", "921.6"),
    new GpuVoltEntry("12", "998.4"),
    new GpuVoltEntry("13", "1075.2"),
    new GpuVoltEntry("14", "1152.0"),
    new GpuVoltEntry("15", "1228.8"),
    new GpuVoltEntry("16", "1267.2"),
    new GpuVoltEntry("17", "1305.6"),
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
    };
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
    };
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
            let obj = CpuTable.concat(GpuTable, RamTable).filter((obj) => {
                return obj.id === this.id;
            })[0];
            obj.value = Number(this.element.value);
            obj.validate();
        });
    }
};
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
        CpuTable.forEach(update);
        GpuTable.forEach(update);
        RamTable.forEach(update);
        AdvTable.forEach(update);
        GpuVoltTable.forEach(update);
        this.storage = {};
        let kv = Object.fromEntries(CpuTable.map(i => [i.id, i.value]));
        Object.assign(this.storage, kv);
        kv = Object.fromEntries(GpuTable.map(i => [i.id, i.value]));
        Object.assign(this.storage, kv);
        kv = Object.fromEntries(RamTable.map(i => [i.id, i.value]));
        Object.assign(this.storage, kv);
        kv = Object.fromEntries(AdvTable.map(i => [i.id, i.value]));
        Object.assign(this.storage, kv);
    }
    setTable() {
        let keys = Object.keys(this.storage);
        keys.forEach(k => {
            let cpuEntry = CpuTable.find(i => i.id === k);
            if (cpuEntry) cpuEntry.value = this.storage[k];
            let gpuEntry = GpuTable.find(i => i.id === k);
            if (gpuEntry) gpuEntry.value = this.storage[k];
            let ramEntry = RamTable.find(i => i.id === k);
            if (ramEntry) ramEntry.value = this.storage[k];
            let advEntry = AdvTable.find(i => i.id === k);
            if (advEntry) advEntry.value = this.storage[k];
        });
        CpuTable.filter(i => !keys.includes(i.id)).forEach(i => i.value = i.defval);
        GpuTable.filter(i => !keys.includes(i.id)).forEach(i => i.value = i.defval);
        RamTable.filter(i => !keys.includes(i.id)).forEach(i => i.value = i.defval);
        AdvTable.filter(i => !keys.includes(i.id)).forEach(i => i.value = i.defval);
        CpuTable.forEach(i => i.setElementValue());
        GpuTable.forEach(i => i.setElementValue());
        RamTable.forEach(i => i.setElementValue());
        AdvTable.forEach(i => i.setElementValue());
        GpuVoltTable.forEach(i => i.setElementValue());
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
        let keys = CpuTable.map(i => i.id)
            .concat(GpuTable.map(i => i.id))
            .concat(RamTable.map(i => i.id))
            .concat(AdvTable.map(i => i.id))
            .concat(GpuVoltTable.map(i => i.id));
        let ignoredKeys = Object.keys(dict).filter(k => !keys.includes(k));
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
        CpuTable.forEach(saveValue);
        GpuTable.forEach(saveValue);
        RamTable.forEach(saveValue);
        AdvTable.forEach(saveValue);
        GpuVoltTable.forEach(saveValue);
        this.storage.save();
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([this.buffer], {
            type: "application/octet-stream"
        }));
        a.download = "loader.kip";
        a.click();
        this.toggleLoadLastSavedBtn(true);
    }
    removeHTMLForm() {
        CpuTable.forEach(i => i.removeElement());
        GpuTable.forEach(i => i.removeElement());
        RamTable.forEach(i => i.removeElement());
        AdvTable.forEach(i => i.removeElement());
        GpuVoltTable.forEach(i => i.removeElement());
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
        } else {
            last_btn.style.setProperty("display", "none");
        }
    }
    createHTMLForm() {
        var _a, _b;
        CpuTable.forEach(i => i.createElement());
        GpuTable.forEach(i => i.createElement());
        RamTable.forEach(i => i.createElement());

        let advanced = document.createElement("p");
        advanced.innerHTML = "Advanced configuration";
        let advancedContainer = document.getElementById("config-list-advanced");

        (_a = advancedContainer) === null || _a === void 0 ? void 0 : _a.appendChild(advanced);

        AdvTable.forEach(i => i.createElement());

        let gpuSection = document.getElementById("config-list-gpuvolt");

        gpuSection.style.display = "none";

        let toggleButton = document.createElement("button");
        toggleButton.innerHTML = "Show Gpu Custom Table";
        toggleButton.style.cursor = 'pointer';

        toggleButton.type = 'button';

        toggleButton.addEventListener("click", () => {
            if (gpuSection.style.display === "none") {
                gpuSection.style.display = "block";
                toggleButton.innerHTML = "Hide Gpu Custom Table";
            } else {
                gpuSection.style.display = "none";
                toggleButton.innerHTML = "Show Gpu Custom Table";
            }
        });

        gpuSection.parentElement.insertBefore(toggleButton, gpuSection);

        GpuVoltTable.forEach(i => i.createElement());

        let default_btn = document.getElementById("load_default");
        default_btn.removeAttribute("disabled");
        default_btn.addEventListener('click', () => {
            CpuTable.forEach(i => i.setElementDefaultValue());
            GpuTable.forEach(i => i.setElementDefaultValue());
            RamTable.forEach(i => i.setElementDefaultValue());
        });

        this.toggleLoadLastSavedBtn(this.storage.load() !== null);

        let save_btn = document.getElementById("save");
        save_btn.removeAttribute("disabled");
        save_btn.addEventListener('click', () => {
            try {
                this.save();
            } catch (e) {
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
                const unfocusedClasses = ["outline"];
                tab.classList.remove(...unfocusedClasses);
                let otherTabs = custTabs.filter(j => j != tab);
                otherTabs.forEach(k => k.classList.add(...unfocusedClasses));
                CpuTable.forEach(e => {
                    e.isAvailableFor(platform) ? e.showElement() : e.hideElement();
                });
                GpuTable.forEach(e => {
                    e.isAvailableFor(platform) ? e.showElement() : e.hideElement();
                });
                RamTable.forEach(e => {
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
        CpuTable.forEach(loadValue);
        GpuTable.forEach(loadValue);
        RamTable.forEach(loadValue);
        AdvTable.forEach(loadValue);
        GpuVoltTable.forEach(loadValue);
    }
    load(buffer) {
        try {
            this.buffer = buffer;
            this.findMagicOffset();
            this.removeHTMLForm();
            this.parse();
            this.initCustTabs();
            this.createHTMLForm();
        } catch (e) {
            console.error(e);
            alert(e);
        }
    }
}

const fileInput = document.getElementById("file");
fileInput.addEventListener('change', async (event) => {
    var cust = new Cust();
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
