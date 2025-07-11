import { useEffect, useState } from "react";
import "./TechniquesPage.css";
import VideoModal from "../components/VideoComponent/VideoModal";

function Techniques() {
    const [techniques, setTechniques] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    useEffect(() => {
        fetch("/techniques.json")
            .then((res) => res.json())
            .then((data) => {
                setTechniques(data);
                setSelectedId(data[0]?.id);
            });
    }, []);

    if (!techniques.length) return <div className="load">Загрузка...</div>;
    const selectedTechnique = techniques.find(
        (technique) => technique.id === selectedId
    );

    const parseText = (text) => {
        const splittedText = text.split(".");
        return splittedText.map((elem) => elem.trim());
    };

    const openVideo = () => setIsVideoOpen(true);
    const closeVideo = () => setIsVideoOpen(false);

    return (
        <>
            <div className="container">
                <div className="clubs__container">
                    <h1 className="clubs__title">Приемы</h1>
                </div>
                <div className="columns">
                    <div className="left_block">
                        <ul className="left_block_ul">
                            {techniques.map((technique) => (
                                <li
                                    key={technique.id}
                                    className={`left_block_li ${
                                        selectedId === technique.id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedId(technique.id)}
                                >
                                    <h3 className="left_block_name">
                                        {technique.name}
                                    </h3>
                                    <span className="left_block_city">
                                        Прием - {technique.technique}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <ul className="mid_block_parts">
                        {selectedTechnique.variants.map((variant) => (
                            <li
                                key={variant.variantID}
                                className="mid_block_part"
                            >
                                <p className="technique__title">
                                    {variant.variantName}
                                </p>
                                <div className="mid_block_content">
                                    {parseText(variant.description).map(
                                        (line, index) => (
                                            <p
                                                key={index}
                                                className="technique__description"
                                            >
                                                {index + 1}. {line}
                                            </p>
                                        )
                                    )}
                                </div>
                                <div
                                    className="video__container"
                                    onClick={openVideo}
                                >
                                    <div className="video__player__container">
                                        <img
                                            className="video__player"
                                            src="../src/assets/techniques/video.svg"
                                            alt="Play"
                                        />
                                    </div>
                                    <img
                                        className="pre__video"
                                        src={variant.preview}
                                        alt="Preview "
                                    />
                                </div>
                                {isVideoOpen && (
                                    <VideoModal
                                        videoLink={variant.video}
                                        closeModal={closeVideo}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Techniques;
