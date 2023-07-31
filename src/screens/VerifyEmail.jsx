import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../config/config";
import CanvasBackground from "../components/CanvasBackground";



function VerifyEmail() {


    const [bgImage, setBgImage] = useState("");

    const [outerHeight, setOuterHeight] = useState("100vh");
    const appContainerRef = useRef();
    const overlayRef = useRef();

    const user = JSON.parse(localStorage.getItem("user"));

    // get today's date
    const now = new Date();
    const yyyy = now.getFullYear();
    let mm = now.getMonth() + 1;
    let dd = now.getDate();
    const tomorrow = new Date(yyyy, mm, dd + 1);
    const dayTomorrow = tomorrow.getDate();
    const monthTomorrow = tomorrow.getMonth();
    const yearTomorrow = tomorrow.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const todayParsed = `${yyyy}-${parseInt(mm)}-${parseInt(dd)}`;
    const today = `${yyyy}-${mm}-${dd}`;
    const tomorrowDate = `${yearTomorrow}-${monthTomorrow}-${dayTomorrow}`;
    const tomorrowDateParsed = `${yearTomorrow}-${parseInt(
        monthTomorrow
    )}-${parseInt(dayTomorrow)}`;

    useEffect(() => {
        const todayImg = localStorage.getItem(`beatific-image-${todayParsed}`);
        const tomorrowImg = localStorage.getItem(
            `beatific-image-${tomorrowDateParsed}`
        );

        if (todayImg) {
            setBgImage(todayImg);
        } else {
            axios
                .get(`${config.serverUrl}/api/v1/images/${today}`)
                .then((res) => {
                    if (res.data.image) {
                        localStorage.setItem(
                            `beatific-image-${todayParsed}`,
                            res.data.image
                        );
                        setBgImage(res.data.image);
                    } else if (!res.data.image && res.message === "Image not found") {
                        console.log("Image not found");

                    }
                })
                .catch((err) => {

                });
        }

        axios
            .get(`${config.serverUrl}/api/v1/images/${today}`)
            .then((res) => {
                if (res.data.image && res.data.image.toString() !== todayImg) {
                    localStorage.setItem(`beatific-image-${todayParsed}`, res.data.image);
                } else if (res.message === "Image not found") {
                    console.log("Image not found");
                }
            })
            .catch((err) => {
                if (!todayImg) {

                }
            });

        if (!tomorrowImg) {
            axios
                .get(`${config.serverUrl}/api/v1/images/${tomorrowDate}`)
                .then((res) => {
                    if (res.data.image) {
                        localStorage.setItem(
                            `beatific-image-${tomorrowDateParsed}`,
                            res.data.image
                        );
                    } else if (res.message === "Image not found") {
                        console.log("Image not found");

                    }
                })
                .catch((err) => {

                });
        }
    }, [today, tomorrowDate, todayParsed, tomorrowDateParsed, user]);

    useEffect(() => {
        setOuterHeight(`${window.innerHeight}px`);
        window.addEventListener("resize", () =>
            setOuterHeight(`${window.innerHeight}px`)
        );
        return () => {
            window.removeEventListener("resize", () =>
                setOuterHeight(`${window.innerHeight}px`)
            );
        };
    }, []);

    useEffect(() => {
        if (!appContainerRef.current && !overlayRef.current) return;
        appContainerRef.current.style.maxHeight = outerHeight;
        appContainerRef.current.style.height = outerHeight;
        overlayRef.current.style.height = outerHeight;
    }, [outerHeight]);

    useEffect(() => {
        let timer = setInterval(() => {
            let localImage = localStorage.getItem(`beatific-image${todayParsed}`);
            if (localImage) {
                setBgImage(localImage);
            }
        }, 300);
        setTimeout(() => {
            clearInterval(timer);
        }, 60 * 1000);
    }, []);


    const parseQueryString = (queryString) => {
        const params = new URLSearchParams(queryString);
        const email = params.get('email');
        const token = params.get('token');
        return { email, token };
    };


    useEffect(() => {
        (async () => {
            const { email, token } = parseQueryString(window.location.search);
            const url = `${config.serverUrl}/api/v1/users/verify-email`
            if (!email || !token) return console.log("Something is missing");

            const result = await axios.post(url, { email, token })
            const data = result.data

            alert(data?.message)
            window.close()

        })()
    }, [])



    return (
        <>
            <CanvasBackground />
            <div
                className="background-image"
                style={{ backgroundImage: `url(${bgImage})` }}
                ref={appContainerRef}
            />
            <div className="App">
                <div className="overlay" ref={overlayRef}>

                </div>
            </div>
        </>
    );
}

export default VerifyEmail;


