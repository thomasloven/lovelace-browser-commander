browser-commander
=================

# This is deprecated - Use [browser_mod](https://github.com/thomasloven/hass-browser_mod) instead

This plugin allows you to controll any browser viewing your lovelace frontend from Home Assistant.

# Example uses

- Make the camera feed from your front door pop up on the tablett in your kitchen when someone rings the doorbell.
- Have a message pop up on every screen in the house when it's bedtime.
- Make the browser on your workstation switch to a specific tab when the kitchen light is on after midnight

## Important note!
From Home Assistant version 0.90, Browser commander will only work if the user that's logged in to the interface you want to controll is in the admin group.

# Installation instructions

This plugin requires [card-tools](https://github.com/thomasloven/lovelace-card-tools) to be installed.

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

# Usage

`browser-commander` is controlled by firing an [event](https://www.home-assistant.io/docs/configuration/events/) from Home Assistant.

The event is called `browser_command` and has one required field - `command`. Each command has more required fields.

E.g. to fire the event from a [script](https://www.home-assistant.io/docs/scripts/):
```yaml
script:
  find_browser_commander_ids:
    sequence:
      - event: browser_command
        event_data:
          command: debug
          id: abc8427e-297dce9a
```

The `id` field specifies which browser or browsers should react to the event. `id` can be either a string or a list of strings with unique browser IDs. If omitted entirely, every browser currently viewing your lovelace interface will react. The unique browser ID can be displayed with the `debug` command.

The commands are:

## `debug`

Will open a popup displaying the browser ID.

## `navigate`

- `navigation_path`

Will open the URL supplied in `navigation_path`, e.g. `/lovelace/0`, `/lovelace/kitchen`

## `more-info`

- `entity_id`
- `large` (optional)

Will open the more-info dialog for `entity_id`, e.g. `camera.front_door`, `light.living_room`, `media_player.tv`.

If `large` is `true`, the more-info dialog will open maximized (i.e. as if you had clicked on the header bar).

Note that if you're using [popup-card](https://github.com/thomasloven/lovelace-popup-card) the popup card will replace the dialog as usual - provided the browser is currently in a view where the popup card is defined.

## `popup`

- `title`
- `card`
- `large` (optional)
- `style` (optional)

Will open a dialog with the heading `title` and contents provided by `card`.
E.g
```yaml
event_data:
  command: popup
  title: Time to turn off the lights?
  card:
    type: entities
    entities:
      - light.bed_light
      - light.kitchen_lights
      - light.outdoors
```

## `close-popup`

Close the popup dialog opened by `popup`, `more-info` or `debug`.

## `lovelace-reload`
Refreshes the lovelace config. Same as clicking "Refresh" in the top right menu.

## `set-theme`

- `theme`

Sets the current theme.

---
<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
