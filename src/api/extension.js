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
      const base = process.env.REACT_APP_EXTENSION_URL || "http://localhost:5173";
      const url = base.replace(/\/$/, "") + "/#/sign-in";
       window.location.href = url;
    }
  },
};

export default extension;
