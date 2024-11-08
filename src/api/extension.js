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
      window.open("https://planner.beatific.co");
    }
  },
};

export default extension;
