PYTHON ?= python3
VENOM_UPDATE := $(PYTHON) Build/venom_update.py
COMPONENT_ARG = $(if $(name),--component "$(name)",)
VERBOSE_ARG = $(if $(verbose),--verbose,)
FULL_ARG = $(if $(full),--full,)
.DEFAULT_GOAL := help

.PHONY: help check-updates update update-all update-dry-run adopt-latest list-components validate build build-nxvenom build-aio release release-draft-upload install-fpslocker-patches clean-update-work clean-update-cache clean-zips clean

help:
	@printf "\n\033[1;36mNX-Venom automation\033[0m\n\n"
	@printf "\033[1;33mUpdate\033[0m\n"
	@printf "  \033[2m%-64s  %s\033[0m\n" "Command" "Description"
	@printf "  \033[2m%-64s  %s\033[0m\n" "----------------------------------------------------------------" "-------------------------------"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make check-updates [name=component]" "Check GitHub releases"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make update-dry-run" "Preview summary"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make update-dry-run name=component" "Preview one component"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make update-dry-run full=1" "Preview full details"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make update-dry-run full=1 name=component verbose=1" "Preview with file paths"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make update name=component" "Update one component + validate"
	@printf "  \033[1;32m%-64s\033[0m  %s\n\n" "make update-all" "Update all + validate"
	@printf "\033[1;33mBuild / Release\033[0m\n"
	@printf "  \033[2m%-64s  %s\033[0m\n" "Command" "Description"
	@printf "  \033[2m%-64s  %s\033[0m\n" "----------------------------------------------------------------" "-------------------------------"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make build" "Build NXVenom.zip and AIO.zip"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make build-nxvenom" "Build NXVenom.zip"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make build-aio" "Build AIO.zip"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make release" "Validate and build release zips"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make install-fpslocker-patches" "Refresh FPSLocker patches"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make release-draft-upload tag=vX.Y.Z" "Upload NXVenom.zip to draft"
	@printf "  \033[1;32m%-64s\033[0m  %s\n\n" "make release-draft-upload tag=vX.Y.Z [title=...] [notes=...]" "Upload with metadata"
	@printf "\033[1;33mUtilities\033[0m\n"
	@printf "  \033[2m%-64s  %s\033[0m\n" "Command" "Description"
	@printf "  \033[2m%-64s  %s\033[0m\n" "----------------------------------------------------------------" "-------------------------------"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make list-components" "Show configured components"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make adopt-latest [name=component]" "Mark latest as accepted"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make validate" "Validate bundle structure"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make clean-update-work" "Remove temporary unpacked files"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make clean-update-cache" "Remove downloaded cache"
	@printf "  \033[1;32m%-64s\033[0m  %s\n" "make clean-zips" "Remove built zip files"
	@printf "  \033[1;32m%-64s\033[0m  %s\n\n" "make clean" "Remove work files and built zips"
	@printf "\033[1;33mGitHub rate limits\033[0m\n"
	@printf "  export GITHUB_TOKEN=... or run gh auth login before bulk checks\n\n"

check-updates:
	@$(VENOM_UPDATE) check $(COMPONENT_ARG)

update:
	@test -n "$(name)" || (echo "Usage: make update name=component" && exit 1)
	@$(VENOM_UPDATE) update --component "$(name)" $(VERBOSE_ARG) $(FULL_ARG)
	@$(VENOM_UPDATE) validate

update-all:
	@$(VENOM_UPDATE) update $(VERBOSE_ARG) $(FULL_ARG)
	@$(VENOM_UPDATE) validate

update-dry-run:
	@$(VENOM_UPDATE) update --dry-run $(COMPONENT_ARG) $(VERBOSE_ARG) $(FULL_ARG)

adopt-latest:
	@$(VENOM_UPDATE) adopt $(COMPONENT_ARG)

list-components:
	@$(VENOM_UPDATE) list

validate:
	@$(VENOM_UPDATE) validate

build: build-nxvenom build-aio

build-nxvenom: install-fpslocker-patches
	@rm -rf NXVenom.zip
	@cd Sources/NXVenom && zip -qqrX ../../NXVenom.zip ./
	@rm -rf Sources/NXVenom/SaltySD/plugins

build-aio:
	@rm -rf AIO.zip
	@cd Sources/AIO && zip -qqrX ../../AIO.zip ./

release: validate build

release-draft-upload:
	@test -n "$(tag)" || (echo "Usage: make release-draft-upload tag=vX.Y.Z [title='...'] [notes='...']" && exit 1)
	@test -f NXVenom.zip || (echo "NXVenom.zip not found. Run make build-nxvenom or make release first." && exit 1)
	@gh release view "$(tag)" >/dev/null 2>&1 || gh release create "$(tag)" --draft $(if $(title),--title "$(title)",) $(if $(notes),--notes "$(notes)",)
	@gh release upload "$(tag)" NXVenom.zip --clobber

install-fpslocker-patches:
	@rm -rf Sources/NXVenom/SaltySD/plugins
	@cd Sources/NXVenom && curl -L https://github.com/masagrator/FPSLocker-Warehouse/archive/refs/heads/v4.zip > patches.zip && unzip -q patches.zip && cp -r FPSLocker-Warehouse-4/SaltySD/plugins SaltySD/ && rm -rf FPSLocker-Warehouse-4 patches.zip

clean-update-work:
	@$(VENOM_UPDATE) clean --work

clean-update-cache:
	@$(VENOM_UPDATE) clean --cache

clean-zips:
	@rm -f NXVenom.zip AIO.zip

clean: clean-update-work clean-zips
