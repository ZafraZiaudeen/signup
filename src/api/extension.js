const extension = {
  openLoginPage: (txId) => {
    try {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage("nlefhoanajbkkbgclihfeklpimfmgbdm", {
        command: "openPage",
        openLoginPage: txId || "",
      });
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage("ammdbipcanekinkojengpemphaeienjk", {
        command: "openPage",
        openLoginPage: txId || "",
      });
    } catch (e) {}
  },
};

export default extension;
