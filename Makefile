PYTHON ?= python3
VENOM_UPDATE := $(PYTHON) Build/venom_update.py
COMPONENT_ARG = $(if $(name),--component "$(name)",)
VERBOSE_ARG = $(if $(verbose),--verbose,)
FULL_ARG = $(if $(full),--full,)
.DEFAULT_GOAL := help

.PHONY: help check-updates update update-dry-run update-one adopt-latest list-components validate build build-nxvenom build-aio release install-fpslocker-patches clean-update-work clean-update-cache clean-zips clean

help:
	@printf "\nNX-Venom automation\n\n"
	@printf "Usage:\n"
	@printf "  make check-updates [name=component]   Check GitHub releases\n"
	@printf "  make update-dry-run                   Preview summary for all components\n"
	@printf "  make update-dry-run name=component    Preview full file changes for one component\n"
	@printf "  make update-dry-run full=1            Preview full file changes for all components\n"
	@printf "  make update-dry-run full=1 name=component verbose=1  Preview with file paths\n"
	@printf "  make update-one name=component        Update one component and validate\n"
	@printf "  make update                           Update all enabled components and validate\n"
	@printf "  make adopt-latest [name=component]    Mark latest as accepted\n"
	@printf "  make validate                         Validate bundle structure\n"
	@printf "  make build                            Build NXVenom.zip and AIO.zip\n"
	@printf "  make list-components                  Show configured components\n"
	@printf "\nGitHub rate limits:\n"
	@printf "  export GITHUB_TOKEN=... or run gh auth login before bulk checks\n"
	@printf "\nExamples:\n"
	@printf "  make check-updates name=atmosphere\n"
	@printf "  make update-dry-run name=hekate\n"
	@printf "  make update-one name=ultrahand\n\n"

check-updates:
	@$(VENOM_UPDATE) check $(COMPONENT_ARG)

update:
	@$(VENOM_UPDATE) update $(COMPONENT_ARG) $(VERBOSE_ARG) $(FULL_ARG)
	@$(VENOM_UPDATE) validate

update-dry-run:
	@$(VENOM_UPDATE) update --dry-run $(COMPONENT_ARG) $(VERBOSE_ARG) $(FULL_ARG)

update-one:
	@test -n "$(name)" || (echo "Usage: make update-one name=component" && exit 1)
	@$(VENOM_UPDATE) update --component "$(name)" $(VERBOSE_ARG) $(FULL_ARG)
	@$(VENOM_UPDATE) validate

adopt-latest:
	@$(VENOM_UPDATE) adopt $(COMPONENT_ARG)

list-components:
	@$(VENOM_UPDATE) list

validate:
	@$(VENOM_UPDATE) validate

build: build-nxvenom build-aio

build-nxvenom:
	@rm -rf NXVenom.zip
	@cd Sources/NXVenom && zip -qqrX ../../NXVenom.zip ./

build-aio:
	@rm -rf AIO.zip
	@cd Sources/AIO && zip -qqrX ../../AIO.zip ./

release: validate install-fpslocker-patches build

install-fpslocker-patches:
	@cd Sources/NXVenom && curl -L https://github.com/masagrator/FPSLocker-Warehouse/archive/refs/heads/v4.zip > patches.zip && unzip -q patches.zip && rm -rf SaltySD/plugins/FPSLocker/patches && cp -r FPSLocker-Warehouse-4/SaltySD/plugins SaltySD/ && rm -rf FPSLocker-Warehouse-4 patches.zip

clean-update-work:
	@$(VENOM_UPDATE) clean --work

clean-update-cache:
	@$(VENOM_UPDATE) clean --cache

clean-zips:
	@rm -f NXVenom.zip AIO.zip

clean: clean-update-work clean-zips
