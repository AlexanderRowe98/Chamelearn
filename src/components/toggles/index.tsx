import { useState } from "react";
import './toggles.css';

interface Props {
    title: string;
    id: string;
    selectedValue: string;
    updateSelectedValue: (value: string) => void;
    options: string[];
}

const MainLanguageSelector = ({
    title,
    id,
    selectedValue,
    updateSelectedValue,
    options
}: Props) => {
    const [selected, setSelected] = useState<string>(selectedValue);

    const handleSelect = (language: string) => {
        setSelected(language);
        updateSelectedValue(language);
    };

    return (
        <>
            <label
                htmlFor={id}
                className="label"
            >
                {title}
            </label>
            <div
                id={id}
                className="toggles-container"
            >
                {options.map((option: string, index: number) => (
                    <div
                        key={index}
                        onClick={() => handleSelect(option)}
                        className={option === selected ? 'toggle toggle-active' : 'toggle'}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </>
    );
};

export default MainLanguageSelector;
