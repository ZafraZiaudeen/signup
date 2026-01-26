const extension = {
  openLoginPage: (txId) => {
    try {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage("nlefhoanajbkkbgclihfeklpimfmgbdm", {
        command: "openPage",
        openLoginPage: txId || "",
      });
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage("gpiecjfijpkmalkpchnifdaldpmchahn", {
        command: "openPage",
        openLoginPage: txId || "",
      });
    } catch (e) {
        const url = process.env.REACT_APP_EXTENSION_URL || "http://localhost:5173/";
        window.open(url);
    }
  },
};

export default extension;
