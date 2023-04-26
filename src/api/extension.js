const extension = {
  openLoginPage: (txId) => {
    try {
      chrome.runtime.sendMessage("nlefhoanajbkkbgclihfeklpimfmgbdm", {
        command: "openPage",
        openLoginPage: txId || "",
      });
      chrome.runtime.sendMessage("ammdbipcanekinkojengpemphaeienjk", {
        command: "openPage",
        openLoginPage: txId || "",
      });
    } catch (e) {}
  },
};

export default extension;
