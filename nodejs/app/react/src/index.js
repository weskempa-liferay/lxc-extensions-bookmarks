import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

class LXCBookmarkApp extends HTMLElement {
  connectedCallback() {
    ReactDOM.createRoot(this).render(
        <App />
    );
  }
}

const ELEMENT_ID = 'lxc-bookmarks';

if (!customElements.get(ELEMENT_ID)) {
  customElements.define(ELEMENT_ID, LXCBookmarkApp);
}