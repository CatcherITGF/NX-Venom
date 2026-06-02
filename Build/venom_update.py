from __future__ import annotations

import argparse
import fnmatch
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
COMPONENTS_DIR = SCRIPT_DIR / "components"
STATE_PATH = SCRIPT_DIR / "state.json"
CACHE_DIR = SCRIPT_DIR / "cache"
WORK_DIR = SCRIPT_DIR / "work"
API_CACHE_DIR = CACHE_DIR / "github-api"
GITHUB_API = "https://api.github.com"
USER_AGENT = "NX-Venom updater"
API_CACHE_TTL_SECONDS = int(os.environ.get("NX_VENOM_API_CACHE_TTL", "900"))
USE_COLOR = os.environ.get("NO_COLOR") is None and os.environ.get("TERM") != "dumb"
ANSI_RESET = "\033[0m"
ANSI_BOLD = "\033[1m"
ANSI_BOLD_YELLOW = "\033[1;33m"
ANSI_GREEN = "\033[1;32m"
ANSI_RED = "\033[1;31m"
ANSI_DIM = "\033[2m"
CARD_SEPARATOR = "────────────────────────────────────────────────────────────"
CATEGORY_ORDER = ["Core", "Overclocking", "Overlays", "Apps / Tools", "Packages"]
ACTION_ORDER = ["delete", "copy", "update", "mkdir", "unchanged", "skip", "protected"]
DEFAULT_EXCLUDES = [".DS_Store", "__MACOSX/**", "*/.DS_Store"]
PROTECTED_PATTERNS = [
  "Sources/NXVenom/bootloader/hekate_ipl.ini",
  "Sources/NXVenom/bootloader/ini/no_oc.ini",
  "Sources/NXVenom/atmosphere/config/**",
  "Sources/NXVenom/atmosphere/config_templates/**",
  "Sources/NXVenom/atmosphere/hosts/**",
  "Sources/NXVenom/atmosphere/kips/**",
  "Sources/NXVenom/config/sys-clk/config.ini",
  "Sources/NXVenom/config/ultrahand/config.ini",
  "Sources/NXVenom/config/ultrahand/fuse.ini",
  "Sources/NXVenom/config/ultrahand/overlays.ini",
  "Sources/NXVenom/config/ultrahand/packages.ini",
  "Sources/NXVenom/config/ultrahand/RELEASE.ini",
  "Sources/NXVenom/config/ultrahand/theme.ini"
]
REQUIRED_PATHS = [
  "Sources/NXVenom/atmosphere/package3",
  "Sources/NXVenom/atmosphere/stratosphere.romfs",
  "Sources/NXVenom/atmosphere/config/system_settings.ini",
  "Sources/NXVenom/atmosphere/kips/hoc.kip",
  "Sources/NXVenom/bootloader/hekate_ipl.ini",
  "Sources/NXVenom/bootloader/update.bin",
  "Sources/NXVenom/bootloader/payloads/fusee.bin",
  "Sources/NXVenom/bootloader/payloads/Lockpick_RCM.bin",
  "Sources/NXVenom/hbmenu.nro",
  "Sources/NXVenom/payload.bin",
  "Sources/NXVenom/switch/.overlays/ovlmenu.ovl",
  "Sources/NXVenom/switch/.overlays/FPSLocker.ovl",
  "Sources/NXVenom/switch/.overlays/ovlSysmodules.ovl",
  "Sources/NXVenom/switch/.overlays/sys-patch-overlay.ovl",
  "Sources/NXVenom/atmosphere/contents/420000000000000B/exefs.nsp",
  "Sources/NXVenom/switch/.packages/RAM Patch/Default/payload.bin",
  "Sources/NXVenom/switch/.packages/RAM Patch/Default/update.bin",
  "Sources/NXVenom/switch/.packages/RAM Patch/Default/reboot_payload.bin",
  "Sources/NXVenom/switch/.packages/Alchemist/package.ini",
  "Sources/NXVenom/switch/.packages/Easy Setup/Package.ini",
  "Sources/NXVenom/switch/.packages/Lightning/package.ini",
  "Sources/NXVenom/switch/.packages/Memory Kit/package.ini",
  "Sources/NXVenom/switch/.packages/RAM Patch/8GB/hekate_ctcaer_6.5.2__ram8GB.bin",
  "Sources/NXVenom/switch/DBI/DBI.nro",
  "Sources/NXVenom/switch/aio-switch-updater/aio-switch-updater.nro",
  "Sources/AIO/config/aio-switch-updater/custom_packs.json",
  "Sources/AIO/switch/aio-switch-updater/aio-switch-updater.nro"
]


def fail(message: str) -> None:
  raise RuntimeError(message)


def now_iso() -> str:
  return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def has_glob(value: str) -> bool:
  return any(ch in value for ch in "*?[")


def parse_scalar(value: str):
  value = value.strip()
  if value == "":
    return None
  if value in ("true", "True"):
    return True
  if value in ("false", "False"):
    return False
  if value in ("null", "Null", "~"):
    return None
  if value[0:1] in ("'", '"'):
    try:
      return json.loads(value)
    except json.JSONDecodeError:
      if value.startswith("'") and value.endswith("'"):
        return value[1:-1]
      raise
  try:
    if value == "0" or not value.startswith("0"):
      return int(value)
  except ValueError:
    pass
  return value


def split_key_value(text: str, line_no: int):
  if ":" not in text:
    fail(f"YAML parse error on line {line_no}: expected key/value")
  key, value = text.split(":", 1)
  key = key.strip()
  if not key:
    fail(f"YAML parse error on line {line_no}: empty key")
  return key, value.strip()


def parse_yaml_block(lines, index: int, indent: int):
  if index >= len(lines):
    return {}, index
  current_indent, text, line_no = lines[index]
  if current_indent < indent:
    return {}, index
  if text.startswith("- "):
    return parse_yaml_sequence(lines, index, current_indent)
  return parse_yaml_mapping(lines, index, current_indent)


def parse_yaml_mapping(lines, index: int, indent: int):
  result = {}
  while index < len(lines):
    current_indent, text, line_no = lines[index]
    if current_indent < indent:
      break
    if current_indent > indent:
      fail(f"YAML parse error on line {line_no}: unexpected indent")
    if text.startswith("- "):
      break
    key, raw_value = split_key_value(text, line_no)
    index += 1
    if raw_value == "":
      if index < len(lines) and lines[index][0] > current_indent:
        value, index = parse_yaml_block(lines, index, lines[index][0])
      else:
        value = {}
    else:
      value = parse_scalar(raw_value)
    result[key] = value
  return result, index


def parse_yaml_sequence(lines, index: int, indent: int):
  result = []
  while index < len(lines):
    current_indent, text, line_no = lines[index]
    if current_indent < indent:
      break
    if current_indent > indent:
      fail(f"YAML parse error on line {line_no}: unexpected indent")
    if not text.startswith("- "):
      break
    item_text = text[2:].strip()
    index += 1
    if item_text == "":
      if index < len(lines) and lines[index][0] > current_indent:
        item, index = parse_yaml_block(lines, index, lines[index][0])
      else:
        item = None
    elif ":" in item_text and not item_text.startswith(("'", '"')):
      key, raw_value = split_key_value(item_text, line_no)
      item = {}
      if raw_value == "":
        if index < len(lines) and lines[index][0] > current_indent:
          value, index = parse_yaml_block(lines, index, lines[index][0])
        else:
          value = {}
      else:
        value = parse_scalar(raw_value)
      item[key] = value
      if index < len(lines) and lines[index][0] > current_indent:
        more, index = parse_yaml_mapping(lines, index, lines[index][0])
        item.update(more)
    else:
      item = parse_scalar(item_text)
    result.append(item)
  return result, index


def parse_yaml(text: str, path: Path):
  lines = []
  for line_no, line in enumerate(text.splitlines(), 1):
    if not line.strip():
      continue
    stripped = line.lstrip(" ")
    if stripped.startswith("#"):
      continue
    if "\t" in line[:len(line) - len(stripped)]:
      fail(f"YAML parse error in {path} on line {line_no}: tabs are not supported")
    indent = len(line) - len(stripped)
    lines.append((indent, stripped.rstrip(), line_no))
  if not lines:
    return {}
  result, index = parse_yaml_block(lines, 0, lines[0][0])
  if index != len(lines):
    _, _, line_no = lines[index]
    fail(f"YAML parse error in {path} on line {line_no}: trailing content")
  return result


def load_data_file(path: Path):
  text = path.read_text(encoding="utf-8")
  if path.suffix == ".json" or text.lstrip().startswith(("{", "[")):
    return json.loads(text)
  return parse_yaml(text, path)


def load_manifests():
  if not COMPONENTS_DIR.exists():
    fail(f"Missing components directory: {COMPONENTS_DIR.relative_to(ROOT_DIR)}")
  manifests = []
  for path in sorted(COMPONENTS_DIR.iterdir()):
    if path.suffix not in (".yaml", ".yml", ".json"):
      continue
    data = load_data_file(path)
    if not isinstance(data, dict):
      fail(f"Manifest {path.relative_to(ROOT_DIR)} must be an object")
    data.setdefault("name", path.stem)
    data["_path"] = path
    manifests.append(data)
  names = [item["name"] for item in manifests]
  duplicates = sorted({name for name in names if names.count(name) > 1})
  if duplicates:
    fail("Duplicate component names: " + ", ".join(duplicates))
  return manifests


def load_state():
  if not STATE_PATH.exists():
    return {"version": 1, "components": {}}
  state = json.loads(STATE_PATH.read_text(encoding="utf-8") or "{}")
  if "components" not in state:
    state = {"version": 1, "components": state}
  state.setdefault("version", 1)
  state.setdefault("components", {})
  return state


def save_state(state) -> None:
  STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")


_GH_CLI_TOKEN_CHECKED = False
_GH_CLI_TOKEN = None


def github_cli_token():
  global _GH_CLI_TOKEN_CHECKED, _GH_CLI_TOKEN
  if _GH_CLI_TOKEN_CHECKED:
    return _GH_CLI_TOKEN
  _GH_CLI_TOKEN_CHECKED = True
  gh = shutil.which("gh")
  if not gh:
    return None
  env = dict(os.environ)
  env["GH_PROMPT_DISABLED"] = "1"
  try:
    result = subprocess.run([gh, "auth", "token"], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, timeout=5, env=env)
  except (OSError, subprocess.TimeoutExpired):
    return None
  token = result.stdout.strip() if result.returncode == 0 else ""
  if token:
    _GH_CLI_TOKEN = token
  return _GH_CLI_TOKEN


def github_token():
  return os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or github_cli_token()


def github_headers():
  headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28"
  }
  token = github_token()
  if token:
    headers["Authorization"] = f"Bearer {token}"
  return headers


def api_cache_path(url: str) -> Path:
  digest = hashlib.sha256(url.encode("utf-8")).hexdigest()
  return API_CACHE_DIR / f"{digest}.json"


def read_api_cache(url: str, allow_stale=False):
  path = api_cache_path(url)
  if not path.exists():
    return None
  try:
    data = json.loads(path.read_text(encoding="utf-8"))
  except json.JSONDecodeError:
    path.unlink(missing_ok=True)
    return None
  saved_at = float(data.get("saved_at", 0))
  age = time.time() - saved_at
  if allow_stale or age <= API_CACHE_TTL_SECONDS:
    return data.get("payload"), age
  return None


def write_api_cache(url: str, payload) -> None:
  API_CACHE_DIR.mkdir(parents=True, exist_ok=True)
  api_cache_path(url).write_text(json.dumps({"saved_at": time.time(), "url": url, "payload": payload}, ensure_ascii=False), encoding="utf-8")


def format_rate_limit_reset(error) -> str:
  reset = error.headers.get("X-RateLimit-Reset")
  if not reset:
    return ""
  try:
    value = datetime.fromtimestamp(int(reset), timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")
  except (TypeError, ValueError):
    return ""
  return f" Wait until {value}, or authenticate."


def rate_limit_help(error) -> str:
  return (
    "GitHub API rate limit exceeded. "
    "Set GITHUB_TOKEN/GH_TOKEN or run `gh auth login` for a higher limit."
    f"{format_rate_limit_reset(error)}"
  )


def request_json(url: str):
  cached = read_api_cache(url)
  if cached:
    return cached[0]
  request = urllib.request.Request(url, headers=github_headers())
  last_error = None
  for attempt in range(3):
    try:
      with urllib.request.urlopen(request, timeout=45) as response:
        payload = json.loads(response.read().decode("utf-8"))
      write_api_cache(url, payload)
      return payload
    except urllib.error.HTTPError as error:
      body = error.read().decode("utf-8", "replace")
      stale = read_api_cache(url, allow_stale=True)
      if stale:
        print(f"warning: using cached GitHub metadata for {url}", file=sys.stderr)
        return stale[0]
      if error.code == 403 and "rate limit" in body.lower():
        fail(rate_limit_help(error))
      fail(f"GitHub request failed {error.code} for {url}: {body[:300]}")
    except urllib.error.URLError as error:
      last_error = error
      stale = read_api_cache(url, allow_stale=True)
      if stale:
        print(f"warning: using cached GitHub metadata for {url}", file=sys.stderr)
        return stale[0]
      if attempt < 2:
        time.sleep(1 + attempt)
  fail(f"GitHub request failed for {url}: {last_error}")


def infer_asset_type(name: str) -> str:
  lower = name.lower()
  if lower.endswith(".zip"):
    return "zip"
  return "file"


def release_endpoint(repo: str, selector: str) -> str:
  if selector == "latest":
    return f"{GITHUB_API}/repos/{repo}/releases/latest"
  return f"{GITHUB_API}/repos/{repo}/releases/tags/{selector}"


def resolve_release(component):
  source = component.get("source") or {}
  repo = source.get("repo")
  if not repo:
    fail(f"Component {component['name']} has no source.repo")
  selector = str(source.get("release", "latest"))
  release = request_json(release_endpoint(repo, selector))
  configured_assets = component.get("assets") or []
  resolved_assets = []
  release_assets = release.get("assets") or []
  for asset_config in configured_assets:
    pattern = asset_config.get("pattern")
    if not pattern:
      fail(f"Component {component['name']} has an asset without pattern")
    matches = [asset for asset in release_assets if fnmatch.fnmatch(asset.get("name", ""), pattern)]
    required = asset_config.get("required", True)
    multiple = asset_config.get("multiple", False)
    if not matches and required:
      available = ", ".join(asset.get("name", "") for asset in release_assets) or "no assets"
      fail(f"Component {component['name']} asset pattern {pattern} matched nothing. Available: {available}")
    if len(matches) > 1 and not multiple:
      fail(f"Component {component['name']} asset pattern {pattern} matched multiple assets: " + ", ".join(asset["name"] for asset in matches))
    for asset in matches:
      resolved_assets.append({
        "name": asset["name"],
        "pattern": pattern,
        "url": asset["browser_download_url"],
        "size": asset.get("size"),
        "type": asset_config.get("type") or infer_asset_type(asset["name"]),
        "strip_top_level": asset_config.get("strip_top_level", False)
      })
  return {
    "component": component,
    "name": component["name"],
    "repo": repo,
    "source_type": "github-release",
    "version": release.get("tag_name") or release.get("name") or str(release.get("id")),
    "revision": release.get("updated_at") or str(release.get("id")),
    "html_url": release.get("html_url"),
    "assets": resolved_assets
  }


def git_remote_branch_sha(repo: str, branch: str):
  git = shutil.which("git")
  if not git:
    return None
  url = f"https://github.com/{repo}.git"
  try:
    result = subprocess.run([git, "ls-remote", "--heads", url, branch], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, timeout=30)
  except (OSError, subprocess.TimeoutExpired):
    return None
  if result.returncode != 0:
    return None
  first = result.stdout.strip().splitlines()[0] if result.stdout.strip() else ""
  if not first:
    return None
  return first.split()[0]


def resolve_branch_archive(component):
  source = component.get("source") or {}
  repo = source.get("repo")
  branch = str(source.get("branch", "main"))
  if not repo:
    fail(f"Component {component['name']} has no source.repo")
  sha = git_remote_branch_sha(repo, branch)
  if not sha:
    branch_info = request_json(f"{GITHUB_API}/repos/{repo}/branches/{branch}")
    sha = branch_info.get("commit", {}).get("sha")
  if not sha:
    fail(f"Component {component['name']} branch {branch} has no commit sha")
  repo_name = repo.split("/", 1)[1]
  asset_name = f"{repo_name}-{branch}-{sha[:12]}.zip"
  return {
    "component": component,
    "name": component["name"],
    "repo": repo,
    "source_type": "github-branch-archive",
    "version": branch,
    "revision": sha,
    "html_url": f"https://github.com/{repo}/tree/{branch}",
    "assets": [{
      "name": asset_name,
      "pattern": asset_name,
      "url": f"https://github.com/{repo}/archive/refs/heads/{branch}.zip",
      "size": None,
      "type": "zip",
      "strip_top_level": True
    }]
  }


def resolve_component(component):
  source_type = (component.get("source") or {}).get("type", "github-release")
  if source_type == "github-release":
    return resolve_release(component)
  if source_type == "github-branch-archive":
    return resolve_branch_archive(component)
  fail(f"Component {component['name']} has unsupported source.type: {source_type}")


def is_outdated(state_entry, target) -> bool:
  if not state_entry:
    return True
  if target["source_type"] == "github-branch-archive":
    return state_entry.get("revision") != target.get("revision")
  return state_entry.get("version") != target.get("version") or state_entry.get("revision") != target.get("revision")


def version_label(entry) -> str:
  if not entry:
    return "untracked"
  version = str(entry.get("version") or "unknown")
  revision = str(entry.get("revision") or "")
  if entry.get("source_type") == "github-branch-archive" and revision:
    return f"{version}@{revision[:7]}"
  return version


def selected_components(manifests, names, include_disabled=False):
  lookup = {}
  for component in manifests:
    keys = [component["name"], component.get("display_name")]
    keys.extend(component.get("aliases") or [])
    for key in keys:
      if not key:
        continue
      lookup[str(key)] = component
      lookup[str(key).lower()] = component
  if names:
    missing = [name for name in names if name not in lookup and name.lower() not in lookup]
    if missing:
      fail("Unknown component(s): " + ", ".join(missing))
    components = [lookup.get(name) or lookup[name.lower()] for name in names]
  else:
    components = manifests
  if include_disabled:
    return components
  return [component for component in components if component.get("enabled", True)]


def cache_path_for(component_name: str, target, asset):
  safe_version = str(target.get("version") or "unknown").replace("/", "_")
  if target["source_type"] == "github-branch-archive":
    safe_version = str(target.get("revision", safe_version))[:12]
  return CACHE_DIR / component_name / safe_version / asset["name"]


def download_validation_error(path: Path, asset):
  expected_size = asset.get("size")
  actual_size = path.stat().st_size
  size_error = None
  if expected_size and actual_size != expected_size:
    size_error = f"size mismatch: got {actual_size}, expected {expected_size}"
  if asset.get("type") == "zip":
    try:
      with zipfile.ZipFile(path) as zip_file:
        bad_member = zip_file.testzip()
      if bad_member:
        return RuntimeError(f"zip validation failed at {bad_member}")
      return None
    except zipfile.BadZipFile as error:
      return RuntimeError(f"invalid zip: {error}; {size_error}" if size_error else f"invalid zip: {error}")
  if size_error:
    return RuntimeError(size_error)
  return None


def download_with_urllib(asset, temporary: Path):
  request = urllib.request.Request(asset["url"], headers=github_headers())
  with urllib.request.urlopen(request, timeout=120) as response, temporary.open("wb") as output:
    shutil.copyfileobj(response, output)


def download_with_curl(asset, temporary: Path):
  curl = shutil.which("curl")
  if not curl:
    raise RuntimeError("curl fallback is unavailable")
  command = [
    curl,
    "-L",
    "--fail",
    "--retry", "3",
    "--retry-delay", "1",
    "-A", USER_AGENT,
    "-o", str(temporary),
    asset["url"]
  ]
  result = subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=180)
  if result.returncode != 0:
    raise RuntimeError(result.stderr.strip() or f"curl failed with exit code {result.returncode}")


def download_asset(component_name: str, target, asset, dry_run=False):
  destination = cache_path_for(component_name, target, asset)
  if destination.exists() and destination.stat().st_size > 0:
    cache_error = download_validation_error(destination, asset)
    if cache_error is None:
      return destination, "cached"
    destination.unlink()
  destination.parent.mkdir(parents=True, exist_ok=True)
  temporary = destination.with_suffix(destination.suffix + ".tmp")
  last_error = None
  for attempt in range(4):
    try:
      download_with_urllib(asset, temporary)
      validation_error = download_validation_error(temporary, asset)
      if validation_error is None:
        temporary.replace(destination)
        return destination, "downloaded"
      last_error = validation_error
      temporary.unlink(missing_ok=True)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, RuntimeError) as error:
      last_error = error
      if temporary.exists():
        temporary.unlink()
    if attempt < 3:
      time.sleep(1 + attempt)
  try:
    download_with_curl(asset, temporary)
    validation_error = download_validation_error(temporary, asset)
    if validation_error is None:
      temporary.replace(destination)
      return destination, "downloaded"
    last_error = validation_error
  except (RuntimeError, subprocess.TimeoutExpired) as error:
    last_error = error
  finally:
    if temporary.exists():
      temporary.unlink()
  fail(f"Download failed for {asset['name']}: {last_error}")


def safe_extract_zip(archive: Path, destination: Path) -> None:
  destination.mkdir(parents=True, exist_ok=True)
  root = destination.resolve()
  with zipfile.ZipFile(archive) as zip_file:
    for member in zip_file.infolist():
      member_path = (destination / member.filename).resolve()
      if root != member_path and root not in member_path.parents:
        fail(f"Unsafe zip entry in {archive.name}: {member.filename}")
    zip_file.extractall(destination)


def prepare_workdir(component_name: str, target, downloaded_assets):
  component_work = WORK_DIR / component_name
  if component_work.exists():
    shutil.rmtree(component_work)
  component_work.mkdir(parents=True, exist_ok=True)
  roots = []
  files_root = component_work / "_files"
  for asset, path in downloaded_assets:
    if asset["type"] == "zip":
      asset_root = component_work / Path(asset["name"]).stem
      safe_extract_zip(path, asset_root)
      root = asset_root
      if asset.get("strip_top_level"):
        children = [item for item in asset_root.iterdir() if item.name not in (".DS_Store", "__MACOSX")]
        directories = [item for item in children if item.is_dir()]
        if len(children) == 1 and len(directories) == 1:
          root = directories[0]
      roots.append({"asset": asset, "root": root})
    elif asset["type"] == "file":
      files_root.mkdir(parents=True, exist_ok=True)
      file_path = files_root / asset["name"]
      shutil.copy2(path, file_path)
      roots.append({"asset": asset, "root": files_root})
    else:
      fail(f"Unsupported asset type for {asset['name']}: {asset['type']}")
  return roots


def resolve_repo_path(value: str) -> Path:
  path = (ROOT_DIR / value).resolve()
  root = ROOT_DIR.resolve()
  if path != root and root not in path.parents:
    fail(f"Path escapes repository root: {value}")
  return path


def relative_to_root(path: Path) -> str:
  return path.resolve().relative_to(ROOT_DIR.resolve()).as_posix()


def path_matches(path: str, patterns) -> bool:
  path = path.replace(os.sep, "/").lstrip("./")
  for pattern in patterns or []:
    pattern = str(pattern).lstrip("./")
    if fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch("/" + path, pattern):
      return True
  return False


def is_protected_destination(path: Path) -> bool:
  try:
    rel = relative_to_root(path)
  except ValueError:
    return True
  return path_matches(rel, PROTECTED_PATTERNS)


def destination_contains_protected(path: Path) -> bool:
  if not path.exists():
    return False
  if is_protected_destination(path):
    return True
  if path.is_dir():
    for child in path.rglob("*"):
      if is_protected_destination(child):
        return True
  return False


def file_hash(path: Path) -> str:
  digest = hashlib.sha256()
  with path.open("rb") as input_file:
    for chunk in iter(lambda: input_file.read(1024 * 1024), b""):
      digest.update(chunk)
  return digest.hexdigest()


def same_file(source: Path, destination: Path) -> bool:
  if not destination.exists() or not destination.is_file():
    return False
  if source.stat().st_size != destination.stat().st_size:
    return False
  return file_hash(source) == file_hash(destination)


def copy_one_file(source: Path, destination: Path, mode: str, dry_run: bool, actions, allow_protected: bool = False) -> None:
  if not allow_protected and is_protected_destination(destination):
    actions.append(("protected", relative_to_root(destination)))
    return
  if mode == "skip-if-exists" and destination.exists():
    actions.append(("skip", relative_to_root(destination)))
    return
  if same_file(source, destination):
    actions.append(("unchanged", relative_to_root(destination)))
    return
  kind = "update" if destination.exists() else "copy"
  actions.append((kind, relative_to_root(destination)))
  if not dry_run:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def remove_destination(destination: Path, dry_run: bool, actions) -> None:
  if not destination.exists():
    return
  if destination_contains_protected(destination):
    fail(f"Refusing to delete protected path: {relative_to_root(destination)}")
  actions.append(("delete", relative_to_root(destination)))
  if dry_run:
    return
  if destination.is_dir():
    shutil.rmtree(destination)
  else:
    destination.unlink()


def copy_directory(source: Path, destination: Path, mode: str, excludes, dry_run: bool, actions, allow_protected: bool = False) -> None:
  if mode == "delete-before-copy":
    remove_destination(destination, dry_run, actions)
  if not dry_run:
    destination.mkdir(parents=True, exist_ok=True)
  for item in sorted(source.rglob("*")):
    rel = item.relative_to(source).as_posix()
    if path_matches(rel, DEFAULT_EXCLUDES) or path_matches(rel, excludes):
      continue
    target = destination / rel
    if item.is_dir():
      if not target.exists():
        actions.append(("mkdir", relative_to_root(target)))
        if not dry_run:
          target.mkdir(parents=True, exist_ok=True)
    elif item.is_file():
      copy_one_file(item, target, mode, dry_run, actions, allow_protected)


def source_candidates(mapping, roots):
  source_pattern = mapping.get("from")
  if not source_pattern:
    fail("Install mapping without from")
  asset_pattern = mapping.get("asset")
  matches = []
  for root_info in roots:
    asset = root_info["asset"]
    if asset_pattern and not fnmatch.fnmatch(asset["name"], asset_pattern):
      continue
    root = root_info["root"]
    if has_glob(source_pattern):
      found = sorted(root.glob(source_pattern))
    else:
      found = [root / source_pattern]
    for item in found:
      if item.exists():
        matches.append(item)
  return matches


def apply_mapping(mapping, roots, dry_run: bool, actions) -> None:
  destination_text = mapping.get("to")
  if not destination_text:
    fail("Install mapping without to")
  mode = mapping.get("mode", "overwrite")
  if mode not in ("overwrite", "skip-if-exists", "delete-before-copy"):
    fail(f"Unsupported install mode: {mode}")
  excludes = mapping.get("exclude") or []
  allow_protected = bool(mapping.get("allow_protected"))
  candidates = source_candidates(mapping, roots)
  if not candidates:
    fail(f"Mapping source not found: {mapping.get('from')}")
  destination_base = resolve_repo_path(destination_text)
  to_is_dir = destination_text.endswith("/")
  for source in candidates:
    if source.is_dir():
      destination = destination_base
      copy_directory(source, destination, mode, excludes, dry_run, actions, allow_protected)
    elif source.is_file():
      destination = destination_base / source.name if to_is_dir else destination_base
      if mode == "delete-before-copy":
        remove_destination(destination, dry_run, actions)
      copy_one_file(source, destination, mode, dry_run, actions, allow_protected)


def apply_install(component, roots, dry_run: bool):
  install = component.get("install") or {}
  mappings = install.get("mappings") or []
  actions = []
  for mapping in mappings:
    apply_mapping(mapping, roots, dry_run, actions)
  return actions


def unique_preserve_order(items):
  seen = set()
  result = []
  for item in items:
    if item in seen:
      continue
    seen.add(item)
    result.append(item)
  return result


def root_for_source(source: Path, roots):
  resolved = source.resolve()
  for root_info in roots:
    root = root_info["root"].resolve()
    if resolved == root or root in resolved.parents:
      return root
  return None


def source_content_entries(source: Path, roots, excludes):
  root = root_for_source(source, roots)
  if root is None:
    return [source.name]

  def excluded(rel_path: str) -> bool:
    if path_matches(rel_path, DEFAULT_EXCLUDES) or path_matches(rel_path, excludes):
      return True
    for pattern in list(DEFAULT_EXCLUDES) + list(excludes or []):
      if pattern.endswith("/**") and rel_path == pattern[:-3].rstrip("/"):
        return True
    return False

  def display_path(item: Path) -> str:
    rel = item.resolve().relative_to(root).as_posix()
    return rel.rstrip("/") + "/" if item.is_dir() else rel

  if source.is_file():
    return [display_path(source)]
  if not source.is_dir():
    return []

  entries = []
  directories = []
  directories_with_files = set()
  for item in sorted(source.rglob("*")):
    rel_from_source = item.relative_to(source).as_posix()
    if excluded(rel_from_source):
      continue
    if item.is_file():
      entries.append(display_path(item))
      parent = item.parent
      while parent != source.parent:
        directories_with_files.add(parent.resolve())
        if parent == source:
          break
        parent = parent.parent
    elif item.is_dir():
      directories.append(item)

  empty_directories = [display_path(item) for item in directories if item.resolve() not in directories_with_files]
  return sorted(empty_directories + entries)


def collect_install_content(component, roots):
  install = component.get("install") or {}
  entries = []
  for mapping in install.get("mappings") or []:
    excludes = mapping.get("exclude") or []
    candidates = source_candidates(mapping, roots)
    if not candidates:
      fail(f"Mapping source not found: {mapping.get('from')}")
    for source in candidates:
      entries.extend(source_content_entries(source, roots, excludes))
  return unique_preserve_order(entries)


def colorize(text: str, color: str) -> str:
  if not USE_COLOR:
    return text
  return f"{color}{text}{ANSI_RESET}"


def card_title(label: str, mode: str, position: int | None, total: int | None) -> str:
  if position is not None and total is not None and total > 1:
    return f"{position}/{total}  {label}"
  return f"[{mode}] {label}"


def render_card(title: str, lines) -> None:
  print(colorize(title, ANSI_BOLD_YELLOW))
  print(colorize("-" * len(title), ANSI_DIM))
  print()
  for line in lines:
    print(line)


def print_update_card(component, target, current_version: str, downloads, content_entries, actions, args, position=None, total=None) -> None:
  label = component.get("display_name") or component["name"]
  mode = "DRY-RUN" if args.dry_run else "UPDATE"
  title = card_title(label, mode, position, total)
  lines = []
  if position is not None and total is not None and total > 1:
    lines.extend(["Mode", f"  {mode}", ""])
  lines.extend(["Version", f"  {current_version} → {version_label(target)}", "", "Content"])
  if content_entries:
    for entry in content_entries:
      lines.append(f"  + {entry}")
  else:
    lines.append("  none")
  if downloads:
    lines.extend(["", "Downloads"])
    download_counts = Counter(item["status"] for item in downloads)
    for status in ("downloaded", "cached"):
      if download_counts.get(status):
        lines.append(f"  {status:<10} {download_counts[status]}")
    if args.verbose:
      for item in downloads:
        cache_path = relative_to_root(item["path"])
        lines.append(f"  {item['status']:<10} {item['asset']['name']}")
        lines.append(f"  {'cache':<10} {cache_path}")
  lines.extend(["", "Changes"])
  counts = Counter(kind for kind, _ in actions)
  if counts:
    for kind in ACTION_ORDER:
      if counts.get(kind):
        lines.append(f"  {kind:<10} {counts[kind]}")
  else:
    lines.append("  none")
  if args.verbose and actions:
    lines.extend(["", "Files"])
    prefix = "would " if args.dry_run else ""
    for kind, path in actions:
      lines.append(f"  {prefix}{kind:<10} {path}")
  lines.extend(["", "Result"])
  if counts.get("protected"):
    lines.append("  Blocked by protected paths")
  elif args.dry_run:
    lines.append("  No files changed")
  else:
    lines.append("  Applied successfully")
  render_card(title, lines)


def print_up_to_date_card(component, current_version: str, position=None, total=None) -> None:
  label = component.get("display_name") or component["name"]
  title = card_title(label, "OK", position, total)
  lines = []
  if position is not None and total is not None and total > 1:
    lines.extend(["Mode", "  OK", ""])
  lines.extend(["Version", f"  {current_version}", "", "Result", "  Already up to date"])
  render_card(title, lines)


def state_record(target):
  return {
    "repo": target.get("repo"),
    "source_type": target.get("source_type"),
    "version": target.get("version"),
    "revision": target.get("revision"),
    "html_url": target.get("html_url"),
    "assets": [{"name": asset["name"], "size": asset.get("size"), "type": asset.get("type")} for asset in target.get("assets", [])],
    "updated_at": now_iso()
  }


def component_label(component) -> str:
  return component.get("display_name") or component["name"]


def component_release_label(component) -> str:
  return component.get("release_name") or component_label(component)


def component_category(component) -> str:
  return component.get("category") or "Other"


def category_index(category: str) -> int:
  try:
    return CATEGORY_ORDER.index(category)
  except ValueError:
    return len(CATEGORY_ORDER)


def sort_components_for_display(components):
  return sorted(components, key=lambda item: (category_index(component_category(item)), component_category(item), component_label(item).lower()))


def grouped_components(components):
  groups = []
  current_category = None
  current_items = []
  for component in sort_components_for_display(components):
    category = component_category(component)
    if category != current_category:
      if current_items:
        groups.append((current_category, current_items))
      current_category = category
      current_items = []
    current_items.append(component)
  if current_items:
    groups.append((current_category, current_items))
  return groups


def action_summary(actions) -> str:
  counts = Counter(kind for kind, _ in actions)
  if not counts:
    return "ok"
  return ", ".join(f"{kind}={counts[kind]}" for kind in ACTION_ORDER if counts.get(kind))


def command_list(args) -> int:
  manifests = load_manifests()
  name_width = max([len(component_label(component)) for component in manifests] + [9])

  for category_index_value, (category, components) in enumerate(grouped_components(manifests)):
    if category_index_value:
      print()
    print(category)
    for component in components:
      state = "✓" if component.get("enabled", True) else "–"
      source = component.get("source") or {}
      repo = source.get("repo", "-")
      label = component_label(component)
      print(f"  {state}  {label:<{name_width}}  {repo}")
  return 0


def print_check_table(rows, updates: int) -> None:
  name_width = max([len(row["label"]) for row in rows] + [9])
  current_width = max([len(row["current"]) for row in rows] + [7])
  latest_width = max([len(row["latest"]) for row in rows] + [6])
  header = f"  {'Component':<{name_width}}  {'Current':<{current_width}}  {'Latest':<{latest_width}}  Status"
  separator = f"  {'-' * name_width}  {'-' * current_width}  {'-' * latest_width}  {'-' * 8}"

  print(colorize("NX-Venom update check", ANSI_BOLD))
  print()
  current_category = None
  for index, row in enumerate(rows):
    if row["category"] != current_category:
      if index:
        print()
      current_category = row["category"]
      print(colorize(current_category, ANSI_BOLD_YELLOW))
      print(colorize(header, ANSI_DIM))
      print(colorize(separator, ANSI_DIM))
    status_label = "UPDATE" if row["status"] == "update" else "OK"
    status_color = ANSI_RED if row["status"] == "update" else ANSI_GREEN
    print(
      f"  {row['label']:<{name_width}}  "
      f"{row['current']:<{current_width}}  "
      f"{row['latest']:<{latest_width}}  "
      f"{colorize(status_label, status_color)}"
    )

  print()
  print(colorize("Summary", ANSI_BOLD_YELLOW))
  print(f"  checked: {len(rows)}")
  print(f"  updates: {colorize(str(updates), ANSI_RED if updates else ANSI_GREEN)}")


def command_check(args) -> int:
  manifests = sort_components_for_display(selected_components(load_manifests(), args.component))
  state = load_state()
  updates = 0
  total = len(manifests)
  rows = []
  show_progress = total > 1
  for index, component in enumerate(manifests):
    if show_progress:
      progress_message(f"Checking updates [{index + 1}/{total}] {component_label(component)}")
    target = resolve_component(component)
    current = state["components"].get(component["name"])
    current_version = version_label(current)
    target_version = version_label(target)
    status = "update" if is_outdated(current, target) else "ok"
    if status == "update":
      updates += 1
    rows.append({
      "category": component_category(component),
      "label": component_label(component),
      "current": current_version,
      "latest": target_version,
      "status": status
    })
  if show_progress:
    progress_clear()
  print_check_table(rows, updates)
  return 2 if updates and args.fail_on_updates else 0


def command_adopt(args) -> int:
  manifests = sort_components_for_display(selected_components(load_manifests(), args.component))
  state = load_state()
  total = len(manifests)
  rows = []
  show_progress = total > 1
  for index, component in enumerate(manifests):
    if show_progress:
      progress_message(f"Adopting latest [{index + 1}/{total}] {component_label(component)}")
    target = resolve_component(component)
    state["components"][component["name"]] = state_record(target)
    rows.append(f"{component['name']}: adopted {version_label(target)}")
  if show_progress:
    progress_clear()
  for row in rows:
    print(row)
  save_state(state)
  return 0


def evaluate_update(component, target, current, args):
  current_version = version_label(current)
  report = {
    "component": component,
    "target": target,
    "current_version": current_version,
    "target_version": version_label(target),
    "downloads": [],
    "content_entries": [],
    "actions": [],
    "record": None,
    "outdated": args.force or is_outdated(current, target)
  }
  if not report["outdated"]:
    return report
  downloaded = []
  for asset in target["assets"]:
    path, status = download_asset(component["name"], target, asset, dry_run=args.dry_run)
    report["downloads"].append({"asset": asset, "path": path, "status": status})
    downloaded.append((asset, path))
  roots = prepare_workdir(component["name"], target, downloaded)
  report["content_entries"] = collect_install_content(component, roots)
  report["actions"] = apply_install(component, roots, args.dry_run)
  report["record"] = state_record(target)
  return report


def protected_paths(report):
  return [path for kind, path in report["actions"] if kind == "protected"]


def print_update_report_full(report, args, position=None, total=None) -> None:
  component = report["component"]
  if not report["outdated"]:
    print_up_to_date_card(component, report["current_version"], position, total)
    return
  print_update_card(
    component,
    report["target"],
    report["current_version"],
    report["downloads"],
    report["content_entries"],
    report["actions"],
    args,
    position,
    total
  )


def summary_result(report) -> str:
  if not report["outdated"]:
    return "ok"
  protected = protected_paths(report)
  if protected:
    return "protected=" + str(len(protected))
  return action_summary(report["actions"])


def print_update_summary(groups, reports_by_name) -> None:
  all_components = [component for _, components in groups for component in components]
  name_width = max([len(component_label(component)) for component in all_components] + [9])
  version_width = max([
    len(f"{reports_by_name[component['name']]['current_version']} → {reports_by_name[component['name']]['target_version']}")
    for component in all_components
  ] + [7])
  print("Dry-run summary")
  print("Use `make update-dry-run full=1` for full details.")
  for category, components in groups:
    print()
    print(category)
    for component in components:
      report = reports_by_name[component["name"]]
      version = f"{report['current_version']} → {report['target_version']}"
      print(f"  {component_label(component):<{name_width}}  {version:<{version_width}}  {summary_result(report)}")


def progress_message(message: str) -> None:
  if sys.stderr.isatty():
    print(f"\r{message}\033[K", end="", file=sys.stderr, flush=True)
  else:
    print(message, file=sys.stderr, flush=True)


def progress_clear() -> None:
  if sys.stderr.isatty():
    print("\r\033[K", end="", file=sys.stderr, flush=True)


def update_progress_label(args) -> str:
  if args.dry_run and args.full:
    return "Preparing full dry-run"
  if args.dry_run:
    return "Preparing dry-run summary"
  return "Updating"


def command_update(args) -> int:
  manifests = sort_components_for_display(selected_components(load_manifests(), args.component))
  groups = grouped_components(manifests)
  state = load_state()
  changed = False
  total = len(manifests)
  reports = []
  show_progress = total > 1
  progress_label = update_progress_label(args)
  for index, component in enumerate(manifests):
    if show_progress:
      progress_message(f"{progress_label} [{index + 1}/{total}] {component_label(component)}")
    target = resolve_component(component)
    current = state["components"].get(component["name"])
    reports.append(evaluate_update(component, target, current, args))
  if show_progress:
    progress_clear()

  if args.dry_run and not args.full and total > 1:
    reports_by_name = {report["component"]["name"]: report for report in reports}
    print_update_summary(groups, reports_by_name)
  else:
    for index, report in enumerate(reports):
      if index:
        print()
      print_update_report_full(report, args, index + 1, total)

  for report in reports:
    protected = protected_paths(report)
    if protected:
      fail("Protected paths would be overwritten: " + ", ".join(protected[:10]))
    if report["record"]:
      changed = True
      if not args.dry_run:
        state["components"][report["component"]["name"]] = report["record"]
  if changed and not args.dry_run:
    save_state(state)
  return 0


def command_validate(args) -> int:
  load_manifests()
  missing = []
  empty = []
  for item in REQUIRED_PATHS:
    path = ROOT_DIR / item
    if not path.exists():
      missing.append(item)
    elif path.is_file() and path.stat().st_size == 0:
      empty.append(item)
  if missing:
    print("missing required paths:")
    for item in missing:
      print(f"  {item}")
  if empty:
    print("empty required files:")
    for item in empty:
      print(f"  {item}")
  if missing or empty:
    return 1
  print("validation ok")
  return 0


def command_clean(args) -> int:
  targets = []
  if args.work:
    targets.append(WORK_DIR)
  if args.cache:
    targets.append(CACHE_DIR)
  if not targets:
    targets.append(WORK_DIR)
  for target in targets:
    if target.exists():
      shutil.rmtree(target)
      print(f"removed {target.relative_to(ROOT_DIR)}")
    else:
      print(f"already clean {target.relative_to(ROOT_DIR)}")
  return 0


def git_capture(arguments) -> str:
  try:
    return subprocess.check_output(["git", *arguments], cwd=ROOT_DIR, text=True, stderr=subprocess.DEVNULL).strip()
  except (FileNotFoundError, subprocess.CalledProcessError):
    return ""


def infer_release_notes_base(tag: str | None) -> str:
  arguments = ["describe", "--tags", "--abbrev=0"]
  if tag:
    arguments.extend(["--exclude", tag])
  arguments.append("HEAD")
  ref = git_capture(arguments)
  if ref:
    return ref
  for item in git_capture(["tag", "--sort=-creatordate"]).splitlines():
    if item and item != tag:
      return item
  return ""


def load_state_from_git(ref: str):
  if not ref:
    return {"components": {}}
  text = git_capture(["show", f"{ref}:Build/state.json"])
  if not text:
    return {"components": {}}
  try:
    return json.loads(text)
  except json.JSONDecodeError:
    return {"components": {}}


def comparable_assets(record) -> list:
  return [(asset.get("name"), asset.get("size"), asset.get("type")) for asset in record.get("assets") or []]


def release_record_changed(previous, current) -> bool:
  if not previous:
    return True
  for key in ("source_type", "version", "revision", "html_url"):
    if previous.get(key) != current.get(key):
      return True
  return comparable_assets(previous) != comparable_assets(current)


def release_notes_line(action: str, component, record) -> str:
  label = component_release_label(component)
  version = version_label(record)
  text = f"{label} {version}"
  url = record.get("html_url")
  if url:
    text = f"[{text}]({url})"
  return f"- {action} {text}"


def command_release_notes(args) -> int:
  manifests = load_manifests()
  components_by_name = {component["name"]: component for component in manifests}
  base_ref = args.from_ref or infer_release_notes_base(args.tag)
  previous_state = load_state_from_git(base_ref)
  current_state = load_state()
  previous_components = previous_state.get("components") or {}
  current_components = current_state.get("components") or {}
  lines = []
  order = 0

  for component in sort_components_for_display(manifests):
    name = component["name"]
    current = current_components.get(name)
    if not current:
      continue
    previous = previous_components.get(name)
    if not release_record_changed(previous, current):
      continue
    action = "Added" if not previous else "Updated"
    priority = 0 if action == "Updated" else 1
    lines.append((priority, order, release_notes_line(action, component, current)))
    order += 1

  manifest_names = set(components_by_name)
  for name in sorted(set(current_components) - manifest_names):
    current = current_components[name]
    previous = previous_components.get(name)
    if not release_record_changed(previous, current):
      continue
    component = {"name": name, "display_name": name}
    action = "Added" if not previous else "Updated"
    priority = 0 if action == "Updated" else 1
    lines.append((priority, order, release_notes_line(action, component, current)))
    order += 1

  if not lines:
    print("- Maintenance update")
    return 0
  print("\n".join(line for _, _, line in sorted(lines)))
  return 0


def build_parser():
  parser = argparse.ArgumentParser(prog="venom_update.py")
  subparsers = parser.add_subparsers(dest="command", required=True)

  list_parser = subparsers.add_parser("list")
  list_parser.set_defaults(func=command_list)

  check_parser = subparsers.add_parser("check")
  check_parser.add_argument("--component", action="append", default=[])
  check_parser.add_argument("--fail-on-updates", action="store_true")
  check_parser.set_defaults(func=command_check)

  adopt_parser = subparsers.add_parser("adopt")
  adopt_parser.add_argument("--component", action="append", default=[])
  adopt_parser.set_defaults(func=command_adopt)

  update_parser = subparsers.add_parser("update")
  update_parser.add_argument("--component", action="append", default=[])
  update_parser.add_argument("--dry-run", action="store_true")
  update_parser.add_argument("--full", action="store_true")
  update_parser.add_argument("--force", action="store_true")
  update_parser.add_argument("--verbose", action="store_true")
  update_parser.set_defaults(func=command_update)

  validate_parser = subparsers.add_parser("validate")
  validate_parser.set_defaults(func=command_validate)

  clean_parser = subparsers.add_parser("clean")
  clean_parser.add_argument("--work", action="store_true")
  clean_parser.add_argument("--cache", action="store_true")
  clean_parser.set_defaults(func=command_clean)

  release_notes_parser = subparsers.add_parser("release-notes")
  release_notes_parser.add_argument("--tag")
  release_notes_parser.add_argument("--from", dest="from_ref")
  release_notes_parser.set_defaults(func=command_release_notes)

  return parser


def main(argv=None) -> int:
  parser = build_parser()
  args = parser.parse_args(argv)
  try:
    return args.func(args)
  except RuntimeError as error:
    print(f"error: {error}", file=sys.stderr)
    return 1


if __name__ == "__main__":
  raise SystemExit(main())
