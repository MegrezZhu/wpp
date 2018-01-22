# wpp

> wpp is short for *wallpaper*

wpp is an easy-to-use & extendable tool to fetch and aggregate wallpaper from different sources (Bing, Unsplash, Windows Spotlight, any local folder, etc). wpp can also be registered as a Windows service for long term auto running.

## Supported Sources

* Unsplash
* Bing Wallpaper
* Windows Spotlight

## Requirement

* Node.js >= 8.0.0

## Installation

1. clone this repo, then `npm i` to install dependencies.
2. `npm build` to compile sources (written in TypeScript), then `npm link .` to make `wpp` a globally usable cli tool.

## Use

* **(Important)** `wpp config` for initialize configurations (path at which fetched wallpapers are placed, for instance).
* `wpp update` manually triggers the procedure ONCE.
* `wpp install` & `wpp uninstall` register/unregister a Windows service for auto running.

For more commands, see `wpp -h`.

Note: `wpp install` (registering as a Windows service) apparently support Windows only, if you are using wpp on other platforms you can choose `wpp run` instead run wpp in foreground.

## More

### Customization

See `src/sources.ts` for examples.
