const extension = {
  openLoginPage: (txId) => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage("ieeoghocjopnnocljhibhgababgemndd", {
      command: "openPage",
      openLoginPage: txId,
    });
  },
};

export default extension;
