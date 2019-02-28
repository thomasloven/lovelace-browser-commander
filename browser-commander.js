customElements.whenDefined('card-tools').then(() => {
window.LovelaceBrowserCommander = window.LovelaceBrowserCommander || (function() {

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
    cardTools.moreInfo(Object.keys(cardTools.hass.states)[0]);
    let moreInfo = document.querySelector("home-assistant")._moreInfoEl;
    moreInfo._page = "none";
    moreInfo.shadowRoot.appendChild(popup);

  setTimeout(() => {
      let interval = setInterval(() => {
        if (moreInfo.getAttribute('aria-hidden')) {
          popup.parentNode.removeChild(popup);
          clearInterval(interval);
        } else {
          message.hass = cardTools.hass;
        }
      }, 100)
    }, 1000);
  }

  cardTools.hass.connection.subscribeEvents((event) => {
    if(event.event_type != event_name) return;
    const data = event.data;
    if(data.id) {
      if(Array.isArray(data.id)) {
        if(!data.id.includes(cardTools.deviceID)) return;
      } else{
        if(data.id != cardTools.deviceID) return;
      }
    }
    if(!data.command) return;

    switch(data.command) {
      case "debug":
        let message = document.createElement('ha-card');
        message.innerHTML = `${cardTools.deviceID}`;
        message.style.padding = '10px';
        makepopup('Device id', message);
        break;
      case "popup":
        if(!data.title) return;
        if(!data.card) return;
        let card = cardTools.createCard(data.card);
        card.hass = cardTools.hass;
        makepopup(data.title, card);
        document.querySelector("home-assistant")._moreInfoEl.large = false;
        if(data.large)
          document.querySelector("home-assistant")._moreInfoEl.large = true;
        break;
      case "navigate":
        if(!data.navigation_path) return;
        history.pushState(null, "", data.navigation_path);
        cardTools.fireEvent("location-changed");
        break;
      case "more-info":
        if(!data.entity_id) return;
        cardTools.moreInfo(data.entity_id);
        document.querySelector("home-assistant")._moreInfoEl.large = false;
        if(data.large)
          document.querySelector("home-assistant")._moreInfoEl.large = true;
        break;
      case "lovelace-reload":
        cardTools.fireEvent("config-refresh");
        break;
      case "close-popup":
        let moreInfo = document.querySelector("home-assistant")._moreInfoEl;
        if (moreInfo) moreInfo.close()
        break;

    };
  });

  return true;

}());
});

window.setTimeout(() => {
  if(window.LovelaceBrowserCommander) return;
  console.error(`%cCARD-TOOLS NOT FOUND
  %cSee https://github.com/thomasloven/lovelace-card-tools`,
  "color: red; font-weight: bold",
  "");
}, 2000);
