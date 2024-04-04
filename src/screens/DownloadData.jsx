import React, { useEffect, useRef, useState } from "react";
import userApi from "../api/user";

export default function DownloadData() {
  // eslint-disable-next-line no-undef
  const initialized = useRef(false);
  const [downloadFailed, setDownloadFailed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  
  const currUrl = new URL(window.location.href);
  const email = currUrl.searchParams.get("email");
  const token = currUrl.searchParams.get("token");

  const handleDownloadData = async () => {
    if (initialized.current) return;
    console.log("Downloading data");

    //set window loading to true
    window.loading = true;

    const res = await userApi.downloadData(email, token);
    if (res.status !== 200) {
      setDownloadFailed(true);

      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        window.open("", "_self").close();
      }, 10000);
    }

    //download file from response
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(res.data)])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.json");
    document.body.appendChild(link);
    link.click();

    //set window loading to false

    window.loading = false;
    
    //close window
    window.open('','_self').close()
  };

  useEffect(() => {
    handleDownloadData();
    // eslint-disable-next-line no-undef
    initialized.current = true;
  }, []);

  useEffect(() => {}, []);
  return <>
    {!downloadFailed ? "Downloading data..." : `Invalid download request. Closing in ${timeLeft} seconds...`}
  </>;
}
