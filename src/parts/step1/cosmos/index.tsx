import React, { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import Ship from './Ship';
import { selectTotal } from '../../../app/gameSlice';
import { useAppSelector } from '../../../app/hooks';
interface InterfaceProps {
    onEarthClick: (pos: { x: number; y: number }) => void;
}

export const Cosmos: React.FC<InterfaceProps> = ({ onEarthClick }) => {
    const [isEarthBouncing, setIsEarthBouncing] = useState(false);
    const total = useAppSelector(selectTotal);


    const handleClick = (event: React.MouseEvent) => {
        const clickPos = {
            x: event.clientX,
            y: event.clientY
        };
        onEarthClick(clickPos);
        
        // Запускаем анимацию подпрыгивания
        setIsEarthBouncing(true);
        setTimeout(() => setIsEarthBouncing(false), 500);
    };
    
    return (
        <div className={styles.cosmos}>
            <div className={styles.background}></div>
            <Ship progress={total/100000} />
            <div className={styles.planets}>
                <div 
                    className={classNames(
                        styles.planet, 
                        styles.earth, 
                        { [styles.bounce]: isEarthBouncing }
                    )} 
                    onClick={handleClick}
                ></div>
                <div className={classNames(styles.group, styles.trappist)}>
                    <div className={classNames(styles.planet, styles.trappistd)}>TRAPPIST-1 d 41</div>
                    <div className={classNames(styles.planet, styles.trappiste)}>TRAPPIST-1 e 41</div>
                    <div className={classNames(styles.planet, styles.trappistf)}>TRAPPIST-1 f 41</div>
                    <div className={classNames(styles.planet, styles.trappistg)}>TRAPPIST-1 g 41</div>
                </div>
                <div className={classNames(styles.planet, styles.toi)}>TOI-700 d 101</div>
                <div className={classNames(styles.planet, styles.k2)}>K2-72 e 217</div>
                <div className={classNames(styles.planet, styles.kepler)}>Kepler-1649 c 301</div>
            </div>
        </div>
    );
};
