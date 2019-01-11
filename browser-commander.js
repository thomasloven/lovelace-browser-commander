try {
  if(!window.cardTools) throw new Error(`Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools`);
  window.cardTools.checkVersion(0.2);
} catch (e) {
  alert("Plugin browser-cmd encountered an error:\n" + e);
}

var LovelaceBrowserCommander = LovelaceBrowserCommander || (function() {

  const event_name = "browser_command";

  const makepopup = (title, message) => {
    let popup = document.createElement('div');
    popup.innerHTML = `
    <style>
      app-toolbar {
        color: var(--more-info-header-color);
        background-color: var(--more-info-header-background);
      }
    </style>
    <app-toolbar>
      <paper-icon-button
        icon="hass:close"
        dialog-dismiss=""
      ></paper-icon-button>
      <div class="main-title" main-title="">
        ${title}
      </div>
    </app-toolbar>
    `;
    popup.appendChild(message);
    window.cardTools.moreInfo(Object.keys(window.cardTools.hass().states)[0]);
    let moreInfo = document.querySelector("home-assistant").__moreInfoEl;
    moreInfo._page = "none";
    moreInfo.shadowRoot.appendChild(popup);
    console.log(moreInfo);

  setTimeout(() => {
      let interval = setInterval(() => {
        if (moreInfo.getAttribute('aria-hidden')) {
          popup.parentNode.removeChild(popup);
          clearInterval(interval);
        } else {
          message.hass = window.cardTools.hass();
        }
      }, 100)
    }, 1000);
  }

  window.cardTools.hass().connection.subscribeEvents((event) => {
    if(event.event_type != event_name) return;
    const data = event.data;
    if(data.id) {
      if(Array.isArray(data.id)) {
        if(!data.id.includes(window.cardTools.deviceID)) return;
      } else{
        if(data.id != window.cardTools.deviceID) return;
      }
    }
    if(!data.command) return;

    switch(data.command) {
      case "debug":
        let message = document.createElement('ha-card');
        message.innerHTML = `${window.cardTools.deviceID}`;
        message.style.padding = '10px';
        makepopup('Device id', message);
        break;
      case "popup":
        if(!data.title) return;
        if(!data.card) return;
        let card = window.cardTools.createCard(data.card);
        card.hass = window.cardTools.hass();
        makepopup(data.title, card);
        break;
      case "navigate":
        if(!data.navigation_path) return;
        history.pushState(null, "", data.navigation_path);
        window.cardTools.fireEvent("location-changed");
        break;
      case "more-info":
        if(!data.entity_id) return;
        window.cardTools.moreInfo(data.entity_id);
        if(data.large)
          document.querySelector("home-assistant").__moreInfoEl.large = true;
        break;
    };
  });

  return true;

}());
