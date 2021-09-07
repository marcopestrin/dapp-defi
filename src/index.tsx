import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import App from "./components/App";
// @ts-ignore
import * as serviceWorker from "./serviceWorker";

declare global {
    interface Window {
        web3: any,
        ethereum: any,
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
