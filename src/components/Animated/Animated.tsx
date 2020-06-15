import React from "react";
import {motion} from "framer-motion"

interface IProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.3,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

export const List: React.FC<IProps> = ({ children, className = '' }) => {
    return <motion.ul className={className}
                      variants={container}
                      initial="hidden"
                      animate="visible"
            >
            {children}
        </motion.ul>
}


export const ListItem: React.FC<any> = ({ children, className = '', onClick }) => {
    return <motion.li className={className} variants={item}>
                {children}
        </motion.li>
}

export const Span: React.FC<{
    children: string;
    className?: string;
}> = ({ children, className = '' }) => {
    return <motion.span className={className} variants={item} initial="hidden" animate="visible">
        {children}
    </motion.span>
}

