import React from "react";
import {motion} from "framer-motion";
import './Popup.css';

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

export const Popup: React.FC<{
    children: JSX.Element[] | JSX.Element;
    isOpen: boolean;
    className?: string;
}> = ({ children, className = '', isOpen }) => {
    if(!isOpen){
        return null
    }
    return <motion.div className={`popup ${className}`} variants={item} initial="hidden" animate="visible">
        <div className="popup-inner">
            {children}
        </div>
    </motion.div>
}
